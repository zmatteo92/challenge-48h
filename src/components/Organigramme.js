import React, { useState, useEffect } from 'react';
import { getAllTeamMembers } from '../db/indexedDB';

function Organigramme() {
    const [teamMembers, setTeamMembers] = useState([]);

    useEffect(() => {
        getAllTeamMembers().then(members => {
            setTeamMembers(members);
        });
    }, []);

    const poles = [...new Set(teamMembers.map(member => member.pole))];

    return (
        <div>
            <h1>Organigramme 2025</h1>
            {poles.map(pole => (
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
            ))}
        </div>
    );
}

export default Organigramme;