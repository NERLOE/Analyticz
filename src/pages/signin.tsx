const SignIn = () => {
  return (
    <div className="min-h-screen bg-landing">
      <div className="flex flex-col justify-center items-center py-12 space-y-8 min-h-screen sm:px-6 lg:px-8 lg:space-y-12">
        <h1>Log In</h1>
        <div aria-label="Sign in form">
          <label>Email:</label>
          <input type="text" />
          <label>Password:</label>
          <input type="password" />
          <button>Log In</button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
