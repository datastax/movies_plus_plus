"use client";

export function ForgotPassword() {
  return (
    <div className="bg-black rounded shadow p-4 border border-neutral-700 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Forgot Password</h1>
      <p>Please fill out the form below to reset your password.</p>
      <form className="flex flex-col gap-4">
        <input
          type="password"
          placeholder="New Password"
          className="border bg-neutral-900 border-neutral-600 px-4 py-2 rounded"
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          className="border bg-neutral-900 border-neutral-600 px-4 py-2 rounded"
        />
        <button
          type="submit"
          onClick={() => {
            alert("You're all set!");
          }}
          className="bg-orange-900 border border-orange-500 text-white p-2 rounded-md"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}
