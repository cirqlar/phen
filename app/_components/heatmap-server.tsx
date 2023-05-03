import tranform_phenotyping_data, { PhenotypingData } from "../_lib/transform";
import Heatmap from "./heatmap-client";


export default async function HeatmapServer() {
	const heatmapData = await fetch("https://raw.githubusercontent.com/mpi2/EBI02126-web-developer/main/gene_phenotypes.json")
		.then(res => res.text())
		.then(text => JSON.parse(text) as PhenotypingData[])
		.then(data => tranform_phenotyping_data(data))
		.catch(err => {
			console.log("An error: ", err);
		});

	return heatmapData ? (
		<Heatmap data={heatmapData} />
	) : (
		<div className="container bg-danger bg-opacity-50 rounded-2 border border-2 border-danger fs-5 px-4 py-4 mt-4 mb-4">
			Error displaying data. Please try again later or contact the developer.
		</div>
	);
}