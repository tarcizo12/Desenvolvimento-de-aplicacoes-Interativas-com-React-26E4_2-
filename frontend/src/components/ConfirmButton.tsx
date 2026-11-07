interface ConfirmButtonProps {
  label: string
  confirmation: string
  onConfirm: () => void
  disabled?: boolean
}

const ConfirmButton = ({
  label,
  confirmation,
  onConfirm,
  disabled = false,
}: ConfirmButtonProps) => (
  <button
    type="button"
    className="button button-danger"
    disabled={disabled}
    onClick={() => {
      if (window.confirm(confirmation)) onConfirm()
    }}
  >
    {label}
  </button>
)

export default ConfirmButton
