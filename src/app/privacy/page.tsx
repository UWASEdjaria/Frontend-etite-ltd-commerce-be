export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
     <div className="max-w-4xl mx-auto px-6 py-12">
     <h1 className="text-4xl font-extrabold text-orange-500 mb-3">Privacy Policy</h1>
      <p className="text-sm text-slate-500 mb-10">Last updated: July 2026</p>
      
      <div className="space-y-8">
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-orange-500 mb-3">1. Information We Collect</h2>
          <p className="text-slate-600 leading-7">We collect information you provide directly to us when creating an account, updating your profile, or placing orders on our Kigali store platform (such as your name, email address, and order details).</p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-orange-500 mb-3">2. How We Use Your Information</h2>
           <p className="text-slate-600 leading-7">Your information is used strictly to process orders, manage secure authentication tokens, and provide customer support regarding your deliveries in Rwanda.</p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-orange-500 mb-3">3. Data Security</h2>
           <p className="text-slate-600 leading-7">We protect your personal data using industry-standard JWT authentication and encrypted storage protocols.</p>
        </section>
      </div>
    </div>
</div>
  );
}