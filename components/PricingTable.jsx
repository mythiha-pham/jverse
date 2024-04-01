'use client';

import styles from '../styles';

/* The PricingTable component is responsible for displaying the pricing table */
export const PricingTable = () => (
  <div className="overflow-hidden border rounded-lg">
    <table className="table-auto w-full bg-slate-700 text-center">
      <thead>
        <tr>
          <th className={`${styles.headerCell}`}>Tier</th>
          <th className={`${styles.headerCell}`}>Volume (minutes/month)</th>
          <th className={`${styles.headerCell}`}>Standard Batch Transcription ($/minute)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className={`${styles.dataCell}`}>T1</td>
          <td className={`${styles.dataCell}`}>First 250,000 minutes</td>
          <td className={`${styles.dataCell}`}>$0.02400</td>
        </tr>
        <tr>
          <td className={`${styles.dataCell}`}>T2</td>
          <td className={`${styles.dataCell}`}>Next 750,000 minutes</td>
          <td className={`${styles.dataCell}`}>$0.01500</td>
        </tr>
        <tr>
          <td className={`${styles.dataCell}`}>T3</td>
          <td className={`${styles.dataCell}`}>Over 1,000,000 minutes</td>
          <td className={`${styles.dataCell}`}>$0.01020</td>
        </tr>
      </tbody>
    </table>
  </div>
);
