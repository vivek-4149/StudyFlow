function ProgressBar({ value }) {
  return (
    <div className="progress-bar">
      <div
        className="progress-bar-fill"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  )
}

export default ProgressBar
