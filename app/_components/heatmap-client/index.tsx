"use client";

import { useCallback, useEffect, useState } from "react";
import { ResponsiveHeatMapCanvas } from "@nivo/heatmap";
import Select from "react-select";
import CloseButton from "react-bootstrap/CloseButton";
import FormRange from "react-bootstrap/FormRange";
import BPagination from "react-bootstrap/Pagination";

import { HeatmapGene, HeatmapGeneData, TransformedData } from "../../_lib/transform";
import styles from "./heatmap.module.css";

const ENTRIES_PER_PAGE = 100;

export default function Heatmap({ data }: { data: TransformedData }) {
	const [filteredData, setFilteredData] = useState<HeatmapGene[]>([]);
	const [paginatedData, setPaginatedData] = useState<HeatmapGene[]>([]);

	const [currentCell, setCurrentCell] = useState<HeatmapGeneData | undefined>(undefined);
	const [paginationInfo, setPaginationInfo] = useState({ page: 1, total_pages: data.genes.length });
	const [activeFilter, setActiveFilter] = useState<"none" | "gene" | "tlp" | "percentile">("none");

	const paginate = useCallback((filtered_data: HeatmapGene[], page: number, count_per_page: number) => {
		if (page < 1) {
			return;
		}

		const page_start = (page - 1) * count_per_page;
		if (page_start >= filtered_data.length) {
			return;
		}
		const paginated = [];

		for (let i = page_start; i < filtered_data.length && i - page_start < 100; i++) {
			paginated.push(filtered_data[i]);
		}

		setPaginatedData(paginated);
		setPaginationInfo({ page, total_pages: Math.ceil(filtered_data.length / ENTRIES_PER_PAGE) });
	}, []);

	const clear = useCallback((genes: HeatmapGene[]) => {
		setFilteredData([]);
		setActiveFilter("none");
		paginate(genes, 1, ENTRIES_PER_PAGE);
	}, [paginate]);

	const filter_by_percentile = useCallback((genes: HeatmapGene[], ranked_genes: number[], percentile: number) => {
		if (percentile < 0 || percentile > 99) {
			return;
		}

		// Subtract percentile from 100 because genes are ranked highest to lowest
		const percentile_limit = Math.round(genes.length * ((100 - percentile) / 100));
		const count_of_limit = genes[ranked_genes[percentile_limit]].total_pTerm_count;

		const filtered: HeatmapGene[] = [];
		for (let i = 0, length = 0; i < genes.length; i++) {
			if (genes[i].total_pTerm_count > count_of_limit) {
				filtered[length] = genes[i];
				length++;
				if (length >= percentile_limit) break;
			}
		}

		setFilteredData(filtered);
		setActiveFilter("percentile");
		paginate(filtered, 1, ENTRIES_PER_PAGE);
	}, [paginate]);

	const filter_by_tlp_term = useCallback((genes: HeatmapGene[], tlp_filter: TransformedData["tlp_terms"]) => {
		const filtered: HeatmapGene[] = [];
		for (let i = 0; i < genes.length; i++) {
			for (let j = 0; j < tlp_filter.length; j++) {
				if (genes[i].data[tlp_filter[j].index].y) {
					filtered.push(genes[i]);
					break;
				}
			}
		}
		setFilteredData(filtered);
		setActiveFilter("tlp");
		paginate(filtered, 1, ENTRIES_PER_PAGE);
	}, [paginate]);

	useEffect(() => {
		// @ts-ignore
		HTMLCanvasElement.prototype.getBBox = function () {
			return { width: this.offsetWidth, height: this.offsetHeight };
		};

		paginate(data.genes, 1, ENTRIES_PER_PAGE);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="mb-5 mt-4">
			<div className="container">
				<h2 id="explore_data">Explore the data</h2>

				<label id="gene_filter_label">Filter by gene list {activeFilter === "gene" && <ActiveTag />}</label>
				<Select
					aria-labelledby="gene_filter_label"
					placeholder="Choose a list of genes"
					className="mb-4"
					options={data.genes}
					getOptionValue={(gene) => gene.id}
					getOptionLabel={(gene) => gene.id}
					closeMenuOnSelect={false}
					isSearchable
					onChange={(newValue, action) => {
						if (newValue.length > 0) {
							setFilteredData(newValue as HeatmapGene[]);
							setActiveFilter("gene");
							paginate(newValue as HeatmapGene[], 1, ENTRIES_PER_PAGE);
						} else {
							clear(data.genes);
						}
					}}
					isMulti
				/>

				<label id="tlp_filter_label">Filter by significant phenotype system {activeFilter === "tlp" && <ActiveTag />}</label>
				<Select
					aria-labelledby="tlp_filter_label"
					placeholder="Choose a list of top level phenotype terms"
					className="mb-4"
					options={data.tlp_terms}
					getOptionValue={(term) => term.top_level_mp_term_name}
					getOptionLabel={(term) => term.top_level_mp_term_name}
					closeMenuOnSelect={false}
					onChange={(newValue, action) => {
						if (newValue.length > 0) {
							filter_by_tlp_term(data.genes, newValue as TransformedData["tlp_terms"]);
						} else {
							clear(data.genes);
						}
					}}
					isMulti
				/>
				<div className="row">
					<div className="col-md-6 mb-3">
						<label id="percentile_filter_label">
							Filter top 10% of genes that have the highest phenotype count {activeFilter === "percentile" && <ActiveTag />}
						</label>
						<FormRange
							min={0}
							max={90}
							step={10}
							defaultValue={0}
							aria-labelledby="percentile_filter-label"
							onChange={(event) => {
								const percentile = Number(event.target.value);
								if (percentile > 0) {
									filter_by_percentile(data.genes, data.ranked_genes, percentile);
								} else {
									clear(data.genes);
								}
							}}
						/>
					</div>

					<p className="col-md-6 text-md-end"><small>Note: Only one filter is active at a time</small></p>
				</div>
			</div>

			<div className="mw-100 overflow-auto mx-3">
				{paginatedData.length > 0
					? (
						<div style={{ height: `${(paginatedData.length * 20) + 170}px` }} className={`mb-4 position-relative ${styles.heatmap_container}`}>
							<ResponsiveHeatMapCanvas
								data={paginatedData}
								margin={{ top: 150, right: 100, bottom: 20, left: 100 }}
								colors={{
									type: "quantize",
									steps: 4,
									colors: [/*"#d6e7f4",*/ "#88dbd9", "#29bcd0", "#009fca", "#0076b6"],
								}}
								enableLabels={false}
								axisTop={{
									tickSize: 5,
									tickPadding: 5,
									tickRotation: -45,
								}}
								axisRight={{
									tickSize: 5,
									tickPadding: 5,
									tickRotation: 0,
								}}
								axisLeft={{
									tickSize: 5,
									tickPadding: 5,
									tickRotation: 0,
								}}
								legends={[
									{
										anchor: "top-left",
										translateX: -90,
										translateY: -80,
										length: 150,
										thickness: 8,
										direction: "row",
										tickPosition: "before",
										tickSize: 3,
										tickSpacing: 4,
										tickOverlap: false,
										tickFormat: ">-.0f",
										title: "Phenotype Count →",
										titleAlign: "start",
										titleOffset: 8
									}
								]}
								borderWidth={4}
								borderColor="#FFFFFF"
								emptyColor="#F6F6F6"
								animate={false}
								onClick={({ data }) => { setCurrentCell(data) }}
								tooltip={({ cell }) => <Tooltip data={cell.data} genes={data.genes} />}
							/>
						</div>
					) : (
						<div>No entries</div>
					)
				}
			</div>

			<div className="container">
				<Pagination
					{...paginationInfo}
					paginate={(page) => paginate(
						activeFilter === "none" ? data.genes : filteredData,
						page,
						ENTRIES_PER_PAGE
					)}
				/>
			</div>

			<div className="position-fixed top-0 start-50 translate-middle-x mt-3">
				{currentCell && (
					<CurrentCell
						genes={data.genes}
						currentCell={currentCell}
						onClose={() => setCurrentCell(undefined)}
					/>
				)}
			</div>
		</div>
	);
}

const ActiveTag = () => <small className="text-secondary ms-2">Active</small>;

const Tooltip = ({
	data, genes
}: {
	data: HeatmapGeneData, genes: HeatmapGene[]
}) => (
	<div className="bg-white bg-opacity-75 rounded-3 shadow py-3 px-4 border position-sticky top-0 start-0 end-0">
		<p className="mb-1">{`${genes[data.index].id} - ${data.x}`}</p>
		<p className="mb-1">{data.y ?? 0} Significant Phenotype Terms</p>
		<p className="mb-1"><small>Click cell for more info</small></p>
	</div>
);

const CurrentCell = ({
	genes, currentCell, onClose,
}: {
	genes: HeatmapGene[], currentCell: HeatmapGeneData, onClose: () => void,
}) => (
	<div className={`bg-white rounded-3 shadow py-3 px-4 border overflow-auto ${styles.current_cell}`}>
		<div className="position-fixed top-0 end-0 mt-3 me-4">
			<CloseButton aria-label="Hide" onClick={() => { onClose() }} />
		</div>
		<p className="mb-2">
			{`Gene: ${genes[currentCell.index].id} (${genes[currentCell.index].marker_accession_id})`}
		</p>
		<p className="mb-2">
			{`Top Level Phenotype Term: ${currentCell.x} (${currentCell.tlp_term_id})`}
		</p>
		{currentCell?.p_terms && currentCell.p_terms.length > 0 && <>
			<p className="mb-2">Phenotype Terms ({currentCell.y}): </p>
			<ul className="mb-2">
				{currentCell.p_terms.map((ptrem) => <li key={ptrem.mp_term_id}>{`${ptrem.mp_term_name} (${ptrem.mp_term_id})`}</li>)}
			</ul>
		</>}
		{currentCell?.procedures && currentCell.procedures.length > 0 && <>
			<p className="mb-2">Procedures: </p>
			<ul className="mb-2">
				{currentCell.procedures.map((procedure) => <li key={procedure}>{procedure}</li>)}
			</ul>
		</>}
	</div>
);

const Pagination = ({
	page, total_pages, paginate,
}: {
	page: number,
	total_pages: number,
	paginate: (page: number) => void,
}) => (
	<BPagination className="justify-content-center">
		<BPagination.First
			disabled={page === 1}
			onClick={() => paginate(1)}
		/>
		<BPagination.Prev
			disabled={page === 1}
			onClick={() => paginate(page - 1)}
		/>
		<BPagination.Item>{page} of {total_pages}</BPagination.Item>
		<BPagination.Next
			disabled={page === total_pages}
			onClick={() => paginate(page + 1)}
		/>
		<BPagination.Last
			disabled={page === total_pages}
			onClick={() => paginate(total_pages)}
		/>
	</BPagination>
);
