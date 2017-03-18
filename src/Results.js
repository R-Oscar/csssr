import React from 'react';
import './Results.css';

const Results = ({visible, data}) =>
	<table className="results" style={{ 'display': visible ? 'table' : 'none' }}>
		<thead>
			<tr>
				<th>№</th>
				<th>Название</th>
				<th>Дата открытия</th>
			</tr>
		</thead>
		<tbody>
			{data.map(element => {
				return <tr key={element.number}>
							<td>{element.number}</td>
							<td>{element.title}</td>
							<td>{new Date(element.created_at).toLocaleString()}</td>
						</tr>
			})}
		</tbody>
	</table>

Results.propTypes = {
	visible: React.PropTypes.bool,
	data: React.PropTypes.array
}

export default Results;