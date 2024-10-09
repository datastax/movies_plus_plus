export function ForgotPassword() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Forgot Password</h1>
      <p>Please fill out the form below to reset your password.</p>
      <form className="flex flex-col gap-4">
        <input type="password" placeholder="New Password" />
        <input type="password" placeholder="Confirm New Password" />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
          Reset Password
        </button>
      </form>
    </div>
  );
}
