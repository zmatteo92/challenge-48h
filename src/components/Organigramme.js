import React, { useState, useEffect } from 'react';
import { getAllTeamMembers } from '../db/indexedDB';

function Organigramme() {
    const [teamMembers, setTeamMembers] = useState([]);

    useEffect(() => {
        getAllTeamMembers().then(members => {
            setTeamMembers(members);
        });
    }, []);

    return (
        <div>
            <h1>Organigramme</h1>
            <div className="team-members">
                {teamMembers.length > 0 ? (
                    teamMembers.map(member => (
                        <div className="member" key={member.id}>
                            <h3>{member.name}</h3>
                            <p><strong>Rôle :</strong> {member.role}</p>
                            <p>{member.description}</p>
                        </div>
                    ))
                ) : (
                    <p>Aucun membre pour le moment.</p>
                )}
            </div>
        </div>
    );
}

export default Organigramme;