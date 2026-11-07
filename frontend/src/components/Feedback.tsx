import Alert from '@mui/material/Alert'

interface FeedbackProps {
  message: string
  kind?: 'error' | 'success' | 'info'
}

const Feedback = ({ message, kind = 'info' }: FeedbackProps) => {
  const severity = kind === 'success' ? 'success' : kind === 'error' ? 'error' : 'info'
  return (
    <Alert severity={severity} variant="outlined" className={`feedback feedback-${kind}`}>
      {message}
    </Alert>
  )
}

export default Feedback
