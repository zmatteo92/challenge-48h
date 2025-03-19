import React, { useState, useEffect } from 'react';
import { getAllTeamMembers } from '../db/indexedDB';

function Organigramme() {
	const [teamMembers, setTeamMembers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		setLoading(true);
		getAllTeamMembers()
			.then(members => {
				setTeamMembers(members);
				setLoading(false);
			})
			.catch(err => {
				console.error('Erreur lors du chargement des membres:', err);
				setError('Une erreur est survenue lors du chargement des membres.');
				setLoading(false);
			});
	}, []);

	const poles = [...new Set(teamMembers.map(member => member.pole))];

	return (
		<div>
			<h1>Organigramme</h1>
			{loading ? (
				<p>Chargement des membres...</p>
			) : error ? (
				<p className="error">{error}</p>
			) : (
				poles.map(pole => (
					<div key={pole}>
						<h2>{pole}</h2>
						<div className="team-members">
							{teamMembers
								.filter(member => member.pole === pole)
								.map(member => (
									<div className="member" key={member.id}>
										<h3>{member.name}</h3>
										<p><strong>Rôle :</strong> {member.role}</p>
										<p>{member.description}</p>
									</div>
								))}
						</div>
					</div>
				))
			)}
		</div>
	);
}

export default Organigramme;