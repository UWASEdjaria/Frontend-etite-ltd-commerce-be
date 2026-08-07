export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
     <div className="max-w-5xl mx-auto px-4">
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 rounded-3xl p-10 text-white shadow-lg mb-10">

     <h1 className="text-4xl font-black">
       Terms of Service
     </h1>

      <p className="mt-3 text-orange-100 text-lg leading-relaxed">
      Please read these Terms of Service carefully before using
      ConstructPro. By accessing our platform, you agree to follow
      these terms when purchasing construction tools and equipment.
      </p>

    </div>
      <div className="space-y-6">
      
       <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-xl font-bold text-orange-500 mb-3">1. Acceptance of Terms</h2>
         <p className="text-slate-600 leading-7">By accessing or using our platform, you agree to be bound by these Terms of Service and all applicable local laws and regulations in Kigali.</p>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
         <h2 className="text-xl font-bold text-orange-500 mb-3">2. User Accounts</h2>
         <p className="text-slate-600 leading-7">You are responsible for maintaining the confidentiality of your account credentials and password. All actions performed under your account token are your responsibility.</p>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-xl font-bold text-orange-500 mb-3">3. Orders and Deliveries</h2>
          <p className="text-slate-600 leading-7">All purchases and guest order tracking operations are subject to item availability and confirmation of fulfillment status.</p>
        </section>
        </div>
      </div>
    </div>
  );
}