import React from 'react';

const GlobalStyles: React.FC = () => (
  <style>{`
    /* Custom Scrollbar for Webkit browsers */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    ::-webkit-scrollbar-track {
      background: var(--pm-dark);
    }
    ::-webkit-scrollbar-thumb {
      background: var(--pm-border);
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: var(--pm-text-secondary);
    }
  `}</style>
);

export default GlobalStyles;
