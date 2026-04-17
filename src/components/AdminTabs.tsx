'use client';

import { useState } from 'react';
import styles from './page.module.css';

interface AdminTabsProps {
  children: {
    [key: string]: React.ReactNode;
  };
}

export default function AdminTabs({ children }: AdminTabsProps) {
  const [activeTab, setActiveTab] = useState(Object.keys(children)[0]);

  return (
    <div className={styles.tabsWrapper}>
      <nav className={styles.adminNav}>
        {Object.keys(children).map((tab) => (
          <button
            key={tab}
            className={`${styles.tabLink} ${activeTab === tab ? styles.activeTabLink : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      <div className={styles.tabContent}>
        {children[activeTab]}
      </div>
    </div>
  );
}
