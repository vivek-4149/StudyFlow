export function getStoredData(key, defaultValue) {
  const storedData = localStorage.getItem(key)

  if (!storedData) {
    return defaultValue
  }

  try {
    return JSON.parse(storedData)
  } catch {
    return defaultValue
  }
}

export function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data))

  if (key === 'studyflow-tasks') {
    window.dispatchEvent(
      new Event('studyflow-tasks-updated'),
    )
  }

  if (key === 'studyflow-subjects') {
    window.dispatchEvent(
      new Event('studyflow-subjects-updated'),
    )
  }

  if (key === 'studyflow-notes') {
    window.dispatchEvent(
      new Event('studyflow-notes-updated'),
    )
  }
}
