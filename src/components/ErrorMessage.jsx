/**
 *
 * @param {{
 *  error: String
 * ParagrahProps: React.ComponentProps<'p'>
 * }}
 * @returns
 */
const ErrorMessage = ({ error, ...ParagrahProps }) => {
  const { className, ...restProps } = ParagrahProps;

  return (
    <p {...restProps} className={`text-red-500 ${className}`}>
      {error}
    </p>
  );
};

export default ErrorMessage;
