import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import toast from "react-hot-toast";

export default function NewsletterForm() {
  useEffect(() => {
    AOS.init();
  }, []);

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data for Web3Forms
    const formData = {
      access_key: "02d1b2b3-faa6-4df3-8941-41f556d61038", // Replace with your Web3Forms access key
      email,
      subject: "New Newsletter Subscription",
    };

    try {
      setIsLoading(true);
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to subscribe");
      }

      toast.success("Subscribed successfully!");
      setEmail("");
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      data-aos="zoom-in"
      className="flex flex-col items-center py-12 mb-6 justify-center p-6 rounded-2xl w-full max-w-md mx-auto sm:max-w-lg md:max-w-xl lg:max-w-2xl"
    >
      <h2 className="text-2xl text-gray-700 newsletter font-bold mb-4 text-center md:text-3xl">
        Subscribe to our newsletter
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row w-full gap-4">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 px-6 py-3 font-bold text-sm bg-white rounded-full shadow-inner focus: outline-none focus:ring-2 focus:ring-teal-400"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-[#007E85] text-white font-bold px-6 py-3 rounded-full shadow-lg hover:bg-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? "Subscribing..." : "Subscribe"}
        </button>
      </form>
    </div>
  );
}