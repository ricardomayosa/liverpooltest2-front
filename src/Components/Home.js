import React, { Component } from 'react';
import axios from 'axios';
// import { Link } from 'react-router-dom';
import { saveQuery } from '../service';

export default class Home extends Component {
	constructor() {
		super();
		this.state = {
			query: '',
			name: '',
			price: '',
			image: '',
			results: [],
			searchHistory: [],
		};
	}
	componentWillMount = () => {
		// Get articles on DB
		this.getSearchHistory();
	};
	handleChange = e => {
		let { query } = this.state;
		query = e.target.value;
		this.setState({ query });
	};
	getSearchHistory() {
		const baseURL =
			window.location.hostname === 'localhost'
				? 'http://localhost:3000'
				: 'https://liverpooltest-2.herokuapp.com/';
		axios.get(baseURL).then(res => {
			const searchHistory = res.data.queries;
			this.setState({ searchHistory });
		});
	}
	setSelectedInput = query => {
		this.setState({ query }, async () => {
			this.getArticles();
		});
	};
	handleSubmit = e => {
		e.preventDefault();
		if (this.state.query !== '') {
			this.getArticles();
		}
	};
	// Search article
	getArticles() {
		axios
			.get(
				`http://www.liverpool.com.mx/tienda?s=${
					this.state.query
				}&d3106047a194921c01969dfdec083925=json `,
			)
			.then(res => {
                // Errores si el resultado no tiene algun atributo
				let results =
					res.data.contents[0].mainContent[3].contents[0].records;

				if (results) {
					this.setState({ results });
					saveQuery(this.state.query, async () => {
						this.getSearchHistory();
					});
				}
			});
	}

	render() {
		const { results } = this.state;
		

		const { searchHistory } = this.state;

		let display = false;
		if (results.length > 0) {
			display = true;
		}
		return (
			<div>
				<hr />
				<h1>Buscador de Liverpool</h1>

				<hr />
				<form onSubmit={this.handleSubmit}>
					<div className="form-group">
						<div className="input-group">
							<input
								type="text"
								className="form-control"
								id="exampleInputEmail1"
								aria-describedby="emailHelp"
								placeholder="Busca un producto"
								name="article"
								defaultValue={this.state.article}
								onChange={this.handleChange}
							/>
							{/* <div className="input-group-append">
								<select
									id="lang"
									onChange={this.setSelectedInput}
								>
									<option value="">
										Historial de busqueda
									</option>
									<option value="select">Select</option>
									<option value="Java">Java</option>
									<option value="C++">C++</option>
								</select>
							</div> */}
						</div>
					</div>
					<button type="submit" className="btn btn-primary">
						Buscar
					</button>
				</form>
				{display ? (
					<div className="card-columns">
						{/* generate a card for each article */}
						{this.state.results.map((result, index) => (
							<div className="card p-3" key={index}>
								<blockquote className="blockquote mb-0 card-body">
									<h5 className="card-title">
										{result.productDisplayName[0]}
									</h5>
									<img
										className="img-thumbnail"
										src={result.smallImage[0]}
										alt={result.name}
									/>
									<p>${result.productPrice[0]}</p>
								</blockquote>
							</div>
						))}
					</div>
				) : (
					// show this if no articles are found on DB
					<h3>No hay articulos que mostrar</h3>
				)}
				<div className="sidenav">
					<h3 style={{ color: 'white' }}>
						<strong>Historial</strong>
					</h3>
					{searchHistory ? (
						<div>
							{this.state.searchHistory.map((q, index) => (
								<h4
									key={index}
									onClick={() =>
										this.setSelectedInput(q.query)
									}
								>
									{q.query}
								</h4>
							))}
						</div>
					) : (
						<div />
					)}
				</div>
			</div>
		);
	}
}
