const FormInput = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  readOnly = false,
  disabled = false,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      disabled={disabled}
      required={!readOnly}
      className={`w-full p-3 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition 
                        ${
                          readOnly || disabled
                            ? "bg-gray-100 border-gray-300 cursor-not-allowed"
                            : "border-gray-300"
                        }`}
    />
  </div>
);

export default FormInput;
