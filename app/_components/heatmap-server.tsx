import tranformGenomeData, { PhenotypingData } from "../_lib/data";
import Heatmap from "./heatmap-client";


export default async function HeatmapServer() {
	const heatmapData = await fetch("https://raw.githubusercontent.com/mpi2/EBI02126-web-developer/main/gene_phenotypes.json")
		.then(res => res.text())
		.then(text => JSON.parse(text) as PhenotypingData[])
		.then(data => tranformGenomeData(data))
		.catch(err => {
			console.log("An error: ", err);
		});

	return heatmapData ? (
		<Heatmap data={heatmapData} />
	) : (<div></div>);
}