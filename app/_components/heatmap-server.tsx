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
	) : (<div></div>);
}