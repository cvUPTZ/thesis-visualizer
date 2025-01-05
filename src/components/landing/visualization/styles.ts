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
    background: linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
    padding: 2rem;
    overflow: hidden;
  }

  .visualization-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
    background: var(--bg-primary);
    border-radius: 24px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05);
    padding: 2rem;
  }

  .central-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-primary);
    border-radius: 50%;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
    transform: rotate(-90deg);
  }

  .section-card {
    position: absolute;
    width: 240px;
    background: var(--bg-primary);
    border-radius: 16px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    padding: 1.5rem;
    transition: all 0.3s ease;
    transform-origin: center;
  }

  .section-card:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .section-header h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .progress-bar {
    width: 100%;
    height: 6px;
    background: var(--secondary-color);
    border-radius: 3px;
    margin: 0.75rem 0;
    overflow: hidden;
  }

  .progress-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--primary-color), #818CF8);
    transition: width 0.5s ease;
  }

  .section-details {
    display: flex;
    justify-content: space-between;
    font-size: 0.875rem;
    color: var(--text-secondary);
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
    padding: 1.25rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s ease;
  }

  .stat-card:hover {
    transform: translateY(-2px);
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
    padding: 0.75rem 1.25rem;
    border-radius: 999px;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s ease;
  }

  .collaborator-card:hover {
    transform: translateY(-2px);
  }

  .active-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--success-color);
  }

  .timeline-card {
    position: absolute;
    left: 2rem;
    top: 50%;
    transform: translateY(-50%);
    background: var(--bg-primary);
    padding: 1.25rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    width: 200px;
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
      transform: scale(0.8) rotate(-90deg);
    }
    
    .stats-dashboard {
      position: relative;
      top: 0;
      right: 0;
      margin-top: 2rem;
    }
  }
`;
