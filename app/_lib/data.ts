type TopLevelPhenotype = {
	top_level_mp_term_id: string,
	top_level_mp_term_name: string,
};
type Phenotype = {
	mp_term_id: string,
	mp_term_name: string,
}

export type PhenotypingData = {
	marker_accession_id: string,
	marker_symbol: string,
	top_level_phenotype_term: TopLevelPhenotype,
	phenotype_terms: Phenotype[],
	phenotype_count: number,
	procedures: string[],
};

export type HeatmapGene = {
	id: string, // marker_symbol
	marker_accession_id: string,
	total_pTerm_count: number,
	data: HeatmapGeneData[],
};

export type HeatmapGeneData = {
	x: string, // tlpTerm_name
	y: number | null, // phenotype_count

	// Extra Data
	index: number,
	tlp_term_id: string,
	p_terms?: Phenotype[],
	procedures?: string[],
};

export type TransformedData = {
	genes: HeatmapGene[],
	tlp_terms: ({
		index: number,
	} & TopLevelPhenotype)[],
	ranked_genes: number[],
};

export default function tranformGenomeData(data: PhenotypingData[]): TransformedData {
	let genes: HeatmapGene[] = [];
	let tlp_terms: TopLevelPhenotype[] = [];

	let index = 0
	for (let phen of data) {
		let gene_index = genes.findIndex(({ id }) => id === phen.marker_symbol);
		if (gene_index === -1) {
			gene_index = genes.length;
			genes.push({
				id: phen.marker_symbol,
				marker_accession_id: phen.marker_accession_id,
				total_pTerm_count: 0,
				data: [],
			});
		}

		let tlpIndex = tlp_terms.findIndex(({ top_level_mp_term_id }) => top_level_mp_term_id === phen.top_level_phenotype_term.top_level_mp_term_id);
		if (tlpIndex === -1) {
			tlpIndex = tlp_terms.length;
			tlp_terms.push(phen.top_level_phenotype_term);
			if (phen.phenotype_count === 0) {
				console.log(phen, index++);
			}
		}

		genes[gene_index].data[tlpIndex] =  ({
			x: phen.top_level_phenotype_term.top_level_mp_term_name,
			y: phen.phenotype_count,

			index: gene_index,
			tlp_term_id: phen.top_level_phenotype_term.top_level_mp_term_id,
			p_terms: phen.phenotype_terms,
			procedures: phen.procedures,
		});
	}

	let ranked_genes: number[] = [];

	for (let i = 0; i < genes.length; i++) {
		for(let j = 0; j < tlp_terms.length; j++) {
			if (genes[i].data[j] === undefined) {
				genes[i].data[j] = {
					x: tlp_terms[j].top_level_mp_term_name,
					y: null,

					index: i,
					tlp_term_id: tlp_terms[j].top_level_mp_term_id,
				}
			} else {
				genes[i].total_pTerm_count += genes[i].data[j].y ?? 0;
			}
		}
		genes[i].data.sort(({ x }, { x: y }) => x.localeCompare(y, 'en-US'));
		ranked_genes[i] = i;
	}

	genes.sort(({ id: a }, { id: b }) => a.localeCompare(b, 'en-US'));
	ranked_genes.sort((a, b) => genes[b].total_pTerm_count - genes[a].total_pTerm_count);

	tlp_terms.sort(({ top_level_mp_term_name: a }, { top_level_mp_term_name: b }) => a.localeCompare(b, 'en-US'));
	(tlp_terms as TransformedData['tlp_terms']).forEach((value, index) => { value.index = index });

	return {
		genes,
		tlp_terms: tlp_terms as TransformedData['tlp_terms'],
		ranked_genes,
	};
}