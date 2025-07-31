import React, { useEffect, useState } from "react";
import styles from './LeadsPage.module.scss';
import {Link} from "react-router-dom";

function LeadsPage() {
    const [leads, setLeads] = useState([]);

    useEffect(() => {
        fetch('/api/clients/leads')
            .then(res => res.json())
            .then(setLeads)
            .catch(console.error);
    }, []);

    console.log(leads)

    return (
        <div className={styles.container}>
            <Link className={styles.backLink} to="/">Назад</Link>

            <div className={styles.tableWrapper}>
                <table className={styles.leadsTable}>
                    <thead>
                    <tr>
                        <th>№ п/п</th>
                        <th>Лид</th>
                        <th>Квалификация лида</th>
                        <th>Результат проработки лида</th>
                        <th>Причина занесения в базу ПК/БР</th>
                    </tr>
                    </thead>
                    <tbody>
                    {leads.map((lead, index) => (
                        <tr key={lead.id || index} className={styles.tableRow}>
                            <td>{index + 1}</td>
                            <td><Link className={styles.nameLink} to={`/client/${lead.id}`}>{lead.company}</Link></td>
                            <td className={styles[`qualification-${lead.qualification}`]}>
                                {lead.qualification}
                            </td>
                            <td className={styles[`result-${lead.result}`]}>
                                {lead.result}
                            </td>
                            <td>{lead.description}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className={styles.summary}>
                <h3>ИТОГО: {leads.length} лидов</h3>
            </div>

            <div className={styles.legend}>
                <div className={styles.legendColumn}>
                    <h4>Квалификация лида</h4>
                    <p><span className={styles.qualificationMK}>МК</span> — малый клиент с одним продуктом</p>
                    <p><span className={styles.qualificationSK}>СК</span> — средний клиент с несколькими продуктами</p>
                    <p><span className={styles.qualificationBK}>БК</span> — большой клиент с большим ассортиментом</p>
                </div>
                <div className={styles.legendColumn}>
                    <h4>Результат проработки лида</h4>
                    <p><span className={styles.resultNK}>НК</span> — Новый Клиент</p>
                    <p><span className={styles.resultPK}>ПК</span> — Потенциальный Клиент</p>
                    <p><span className={styles.resultBR}>БР</span> — Брак</p>
                </div>
            </div>
        </div>
    );
}

export default LeadsPage;