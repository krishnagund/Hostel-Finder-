import LoginModal from "./LoginModal";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <LoginModal isOpen={true} onClose={() => {}} />
    </div>
  );
};

export default LoginPage;
