import Image from 'next/image';
import styles from './page.module.css'

import embryo_photo1 from "./_images/embryo_image_1.jpeg";
import embryo_photo2 from "./_images/embryo_image_2.jpg";
import embryo_photo3 from "./_images/embryo_image_3.jpeg";
import HeatmapServer from './_components/heatmap-server';

export default async function Home() {

	return (
		<main className="">
			<section className="container col-xxl-8 px-4 py-5">
				<div className="row flex-lg-row-reverse align-items-center g-5 py-5">
					<div className="col-lg-6">
						<Image className={`${styles.image} col-4`} src={embryo_photo1} height="120" alt="picture of an embryo"/>
						<Image className={`${styles.image} col-4`} src={embryo_photo2} height="120" alt="picture of an embryo"/>
						<Image className={`${styles.image} col-4`} src={embryo_photo3} height="120" alt="picture of an embryo"/>
					</div>
					<div className="col-lg-6">
						<h1>IMPC Embryo Data</h1>
						<p className="lead">Compare the knockout effects of the top 10% of genes from the IMPC Gene-Phenotype Associations dataset in different phenotyping systems.</p>
						<a href="#explore_data" className="btn btn-secondary btn-lg text-white">Explore the Data</a>
					</div>
				</div>
			</section>
			<section className="container">
				<h2>Introduction to IMPC Embryo Data</h2>
				<p>
					Up to one third of homozygous knockout lines are lethal, which means no homozygous mice or less than expected are observed past the weaning stage (IMPC <a href="https://www.mousephenotype.org/impress/ProcedureInfo?action=list&amp;procID=703&amp;pipeID=7" rel="nofollow">Viability Primary Screen procedure</a>). Early death may occur during embryonic development or soon after birth, during the pre-weaning stage. For this reason, the IMPC established a <a href="//www.mousephenotype.org/impress" rel="nofollow">systematic embryonic phenotyping pipeline</a> to morphologically evaluate mutant embryos to ascertain the primary perturbations that cause early death and thus gain insight into gene function.
				</p>
				<p>
					As determined in IMPReSS (see interactive diagram <a href="https://www.mousephenotype.org/impress" rel="nofollow">here</a>), all embryonic lethal lines undergo gross morphology assessment at E12.5 (embryonic day 12.5) to determine whether defects occur earlier or later during embryonic development. A comprehensive imaging platform is then used to assess dysmorphology. Embryo gross morphology, as well as 2D and 3D imaging are actively being implemented by the IMPC for lethal lines.
				</p>
				<p>
					Read more in our paper on <a href="https://europepmc.org/article/PMC/5295821" rel="nofollow">High-throughput discovery of novel developmental phenotypes, Nature 2016.</a>
				</p>

				<h3>Accessing Embryo Phenotype Data</h3>
				<p>Embryo phenotype data can be accessed in multiple ways:</p>
				<ul>
					<li>
						<a href="https://github.com/mpi2/EBI02126-web-developer/blob/main/data/embryo_imaging" rel="nofollow">Embryo Images: interactive heatmap</a> A compilation of all our Embryo Images, organised by gene and life stage, with access to the Interactive Embryo Viewer, where you can compare mutants and wild types side by side and rotate 2D and 3D images; we also provide access to our external partners&apos; embryo images.
					</li>
					<li>
						<a href="https://github.com/mpi2/EBI02126-web-developer/blob/main/data/embryo/vignettes" rel="nofollow">Embryo Vignettes</a> Showcase of best embryo images with detailed explanations.
					</li>
					<li>
						From the FTP site, latest release All our results. Reports need to be filtered by a dedicated column, Life Stage (E9.5, E12.5, E15.5 and E18.5). Please check the README file or see documentation <a href="https://www.mousephenotype.org/help/non-programmatic-data-access/" rel="nofollow">here</a>.
					</li>
					<li>
						Using the REST API (see documentation <a href="https://www.mousephenotype.org/help/programmatic-data-access/" rel="nofollow">here</a>)
					</li>
				</ul>

				<h3>Determining Lethal Lines</h3>
				<p>
					The IMPC assesses each gene knockout line for viability (Viability Primary Screen <a href="//www.mousephenotype.org/impress/ProcedureInfo?action=list&amp;procID=703&amp;pipeID=7" rel="nofollow">IMPC_VIA_001</a>). In this procedure, the proportion of homozygous pups is determined soon after birth, during the preweaning stage, in litters produced from mating heterozygous animals. A line is declared lethal if no homozygous pups for the null allele are detected at weaning age, and subviable if pups homozygous for the null allele constitute less than 12.5% of the litter.
				</p>
				<p>
					Lethal strains are further phenotyped in the <a href="//www.mousephenotype.org/impress" rel="nofollow">embryonic phenotyping pipeline</a>. For embryonic lethal and subviable strains, heterozygotes are phenotyped in the IMPC <a href="//www.mousephenotype.org/impress" rel="nofollow">adult phenotyping pipeline</a>.
				</p>
			</section>
			<section>
				{/* @ts-expect-error Server Component */}
				<HeatmapServer />
			</section>
		</main>
	)
}
