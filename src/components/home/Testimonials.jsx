import React, { useEffect, useState } from "react";
// import { axios } from "../../import-export/ImportExport";
import { toast } from "react-toastify";
import axios from "axios";

function Testimonials() {
  const [testimonial, setTestimonial] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [review, setReview] = useState("");
  const [image, setImage] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/testimonial/getall"
        );
        setTestimonial(response.data.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    fetchTestimonials();
  }, []);
  // const [currentIndex, setCurrentIndex] = useState(0);

  // const handleNext = () => {
  //   setCurrentIndex((prevIndex) =>
  //     prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
  //   );
  // };

  // const handlePrev = () => {
  //   setCurrentIndex((prevIndex) =>
  //     prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
  //   );
  // };

  const handleFeedback = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post(
          "http://localhost:8000/api/v1/testimonial/add",
          { fullName, email, country, state, review },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        )
        .then((res) => {
          toast.success(res.data.message);
          setFullName("");
          setEmail("");
          setCountry("");
          setState("");
          setReview("");
          setImage("");
          setShowForm(false);
        });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <main className="w-full">
      <section className="my-20 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 content-center justify-items-center px-3 md:px-6 lg:px-8 gap-y-6">
        {/* Text container */}
        <div className="flex flex-col items-center">
          <div className="h-full w-full lg:w-2/3 md:space-y-6 space-y-3">
            <h3 className="text-md text-dark_theme font-medium">Testimonial</h3>
          <h1 className="text-3xl lg:text-4xl text-dark_theme font-bold text-black-700 rounded-full">
              Que disent-ils ?
            </h1>
            <p className="text-md text-text_grey">
              MediLink a plus de
              <span className="text-dark_theme font-medium ml-1">
                10 000 évaluations positives
              </span>{" "}
              de nos utilisateurs du pays.
            </p>
            <p className="text-md text-text_grey">
              Certains médecins et patients ont été grandement aidés par le Medi-Link
            </p>
            <p className="text-md text-text_grey">
              Et vous aussi ? Donnez votre avis.
            </p>

            {/* Feedback cta */}
            <button
              onClick={() => setShowForm(true)}
              className="border border-dark_theme hover:bg-light_theme text-dark_theme py-2 px-4 rounded-full hover:bg-opacity-100"
            >
              Envoyez vos commentaires &#8594;
            </button>
          </div>
        </div>

        {/* Testimonial cards container */}
        <div className="w-full flex justify-center items-start lg:items-center relative">
          {/* image container */}
          <div className="w-56 h-60 lg:w-64 lg:h-72 bg-testimonial_img_bg px-4 py-2 md:py-0 rounded-md">
            <img
              src="data:image/jpeg;base64,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"
              alt="image"
              className="w-full h-full object-contain md:object-center object-top"
            />

            {/* feedback messasges and ratings */}
            <div className="absolute bottom-[-25%] right-[5%] lg:bottom-[-3%] md:bottom-0 lg:right-[4%] max-w-[190px] md:max-w-[250px] lg:max-w-xs max-h-32 bg-white px-4 py-4 rounded-md flex flex-col gap-y-4 shadow-lg">
              {/* feeback msg  */}
              <div className="overflow-hidden">
                <p className="line-clamp-3 md:line-clamp-4 text-sm text-text_grey tracking-wide">
                  J'ai adoré l'expérience chez Medi-Link, le meilleur système de soins
                   de santé qui facilite la vie de l'utilisateur.
                </p>
              </div>

              {/* name and rating stars */}
              <div className="flex justify-between items-center">
                <div className="max-w-16 overflow-hidden">
                  <h4 className="truncate text-dark_theme font-medium">
                    jean pierre
                  </h4>
                </div>
                <div className="flex gap-x-1">stars</div>
              </div>
            </div>
            {/* <h4 className="font-bold text-center">
              {testimonials[currentIndex].profile}
            </h4>
            <p className="text-sm text-center mb-6">
              {testimonials[currentIndex].country},{" "}
              {testimonials[currentIndex].state}
            </p>
            <p className="mt-2 text-center">
              {testimonials[currentIndex].review}
            </p>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
              <button
                onClick={handlePrev}
                className="bg-white bg-opacity-50 text-black rounded-full p-2 hover:bg-opacity-100"
              >
                &#8592;
              </button>
              <button
                onClick={handleNext}
                className="bg-white bg-opacity-50 text-black rounded-full p-2 hover:bg-opacity-100"
              >
                &#8594;
              </button>
            </div> */}
          </div>
        </div>

        {/* Testiomonials message*/}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 border border-gray-300 rounded-lg shadow-md w-full max-w-md mx-auto">
              <form
                onSubmit={handleFeedback} // send feedback
                className="flex flex-col items-center space-y-4"
              >
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your Full Name"
                  className="p-2 border border-gray-300 rounded w-full"
                />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your Email Address"
                  className="p-2 border border-gray-300 rounded w-full"
                />
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Country"
                  className="p-2 border border-gray-300 rounded w-full"
                />
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="State"
                  className="p-2 border border-gray-300 rounded w-full"
                />
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Your Review"
                  className="p-2 border border-gray-300 rounded w-full"
                ></textarea>
                <input
                  type="file"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Profile Picture URL"
                  className="p-2 border border-gray-300 rounded w-full"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default Testimonials;
