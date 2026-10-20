// Adapted from the supplied React torch demo. The physical switch and beam share one state.
export default function Flashlight({ isOn, isReady, onToggle }) {
  return <>
    <div className="torch-stage">
      <div className="impact-ring" aria-hidden="true" />
      <div className="spark spark-one" aria-hidden="true" />
      <div className="spark spark-two" aria-hidden="true" />
      <div className="spark spark-three" aria-hidden="true" />
      <div className="torch">
        <div className="torch-lens" aria-hidden="true"><span /></div>
        <div className="torch-neck" aria-hidden="true" />
        <div className="torch-body">
          <i aria-hidden="true" /><i aria-hidden="true" /><i aria-hidden="true" />
          <button className={`torch-switch ${isOn ? 'is-on' : ''}`} type="button"
            aria-label={isOn ? 'Turn flashlight off' : 'Turn flashlight on'}
            aria-pressed={isOn} disabled={!isReady} onClick={onToggle}>
            <span className="switch-label" aria-hidden="true"><b className={isOn ? 'is-active' : ''}>ON</b><b className={!isOn ? 'is-active' : ''}>OFF</b></span>
          </button>
        </div>
        <div className="torch-cap" aria-hidden="true" />
      </div>
    </div>
    <div className={`torch-status ${isOn ? 'is-on' : 'is-off'}`} role="status"><span /><div><strong>LIGHT {isOn ? 'ON' : 'OFF'}</strong><small>{isReady ? 'PRESS TORCH SWITCH' : 'TORCH INCOMING'}</small></div></div>
  </>
}
