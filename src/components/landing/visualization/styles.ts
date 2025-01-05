export const styles = `
  .thesis-viz {
    --primary-color: #4F46E5;
    --secondary-color: #E5E7EB;
    --success-color: #10B981;
    --warning-color: #F59E0B;
    --error-color: #EF4444;
    --text-primary: #111827;
    --text-secondary: #6B7280;
    --bg-primary: #FFFFFF;
    --bg-secondary: #F8FAFC;
  }

  .thesis-container {
    min-height: 100vh;
    background: var(--bg-primary);
    padding: 2rem;
    overflow: hidden;
  }

  .visualization-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
    background: var(--bg-primary);
  }

  .central-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
  }

  .central-icon-pulse {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: var(--primary-color);
    opacity: 0.2;
    animation: pulse 2s infinite;
  }

  .sections-circle {
    position: relative;
    width: 800px;
    height: 800px;
    margin: 0 auto;
  }

  .section-card {
    position: absolute;
    width: 200px;
    background: var(--bg-primary);
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    transition: all 0.3s ease;
  }

  .section-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  .progress-bar {
    width: 100%;
    height: 4px;
    background: var(--secondary-color);
    border-radius: 2px;
    margin: 0.5rem 0;
    overflow: hidden;
  }

  .progress-bar-fill {
    height: 100%;
    background: var(--primary-color);
    transition: width 0.5s ease;
  }

  .stats-dashboard {
    position: absolute;
    top: 2rem;
    right: 2rem;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  .stat-card {
    background: var(--bg-primary);
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .collaboration-panel {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 1rem;
  }

  .collaborator-card {
    background: var(--bg-primary);
    padding: 0.75rem 1rem;
    border-radius: 999px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .notifications-panel {
    position: fixed;
    top: 2rem;
    right: 2rem;
    background: var(--bg-primary);
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    z-index: 50;
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 0.2;
    }
    50% {
      transform: scale(1.5);
      opacity: 0.1;
    }
    100% {
      transform: scale(1);
      opacity: 0.2;
    }
  }

  @media (max-width: 1024px) {
    .sections-circle {
      transform: scale(0.8);
    }
    
    .stats-dashboard {
      position: relative;
      top: 0;
      right: 0;
      margin-top: 2rem;
    }
  }
`;
