import Image from 'next/image';
import { Roboto } from 'next/font/google'

import './globals.scss'

const roboto = Roboto({ weight: ['300', '400', '500'], subsets: ['latin'] });

export const metadata = {
	title: 'IMPC Embryo Data',
	description: 'Compare the knockout effects of the top 10% list of genes from the IMPC Gene-Phenotype Associations dataset',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body className={roboto.className}>
				<header className="bg-light">
					<nav className="navbar py-4">
						<div className="container">
							<a href="https://www.mousephenotype.org/" rel="nofollow" className="navbar-brand">
								<Image src="/IMPC_logo.svg" className='my-2' alt="IMPC logo" width="170" height="50" priority />
							</a>

						</div>
					</nav>
				</header>
				{children}

				<footer className="bg-light">
					<nav className="navbar navbar-expand py-4">
						<div className="container">
							<p className="navbar-brand mb-0">Ayanfe Ibitoye</p>
							
							<ul className="navbar-nav">
								<li className="nav-item"><a className="nav-link" href="https://github.com/cirqlar/phen">Source</a></li>
								<li className="nav-item"><a className="nav-link" href="https://github.com/cirqlar">Profile</a></li>
								<li className="nav-item"><a className="nav-link" href="https://github.com/mpi2/EBI02126-web-developer/blob/main/gene_phenotypes.json">Data</a></li>
							</ul>
						</div>
					</nav>
				</footer>
			</body>
		</html>
	)
}
