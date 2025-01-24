import { Linkedin, Instagram, Github, Youtube, Facebook } from "lucide-react"; // Import Lucide Icons
import Link from "next/link";

const Footer = () => {
  return (
    <div className="bg-[#4B3F72] text-white py-8 mt-10 p-9 max-sm:p-5">
      <div className="w-full max-w-[1200px] m-auto flex flex-col gap-8">
        <div className="flex flex-wrap justify-between gap-8">
          <div className="w-full sm:w-1/3">
            <h3 className="text-xl font-semibold mb-4">About DBIT</h3>
            <p className="text-sm">
              Don Bosco Institute of Technology (DBIT) is committed to providing
              quality education and holistic development to students. Located in
              the heart of the city, DBIT offers a wide range of undergraduate
              and postgraduate programs to prepare students for successful
              careers in various industries.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-semibold mb-4">Follow us</h3>
            <div className="flex gap-2">
              <Link
                href="https://www.linkedin.com/in/donboscoitggsipu"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="w-8 h-8 hover:text-white text-[#0077b5]" />
              </Link>
              <Link
                href="https://www.instagram.com/donbosco_ggsipu"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="w-8 h-8 hover:text-white text-[#E4405F]" />
              </Link>
              <Link
                href="https://www.youtube.com/channel/UCM4ZafIAJQ20jgpIMqcNshA"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Youtube color="#e20303" className="w-8 h-8 hover:text-white" />
              </Link>

              <Link
                href="https://www.facebook.com/bttsggsipu"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook
                  color="#2b41ee"
                  className="w-8 h-8 hover:text-white"
                />
              </Link>
            </div>
          </div>
        </div>


        <div className="flex justify-between items-center max-sm:flex-col gap-4">
          
          <div className="flex flex-col gap-2 text-start w-full ">
            <p className="font-medium">Website Created By</p>
            <Link
              href="https://www.linkedin.com/in/kamlesh-sahani"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:underline flex gap-2 items-center text-sm ml-2"
            >
              Kamlesh Sahani
              <Linkedin className="w-5 h-5 hover:text-white text-[#0077b5]" />
            </Link>

            <Link
              href="https://www.linkedin.com/in/saad-mehmood-4a6036255/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:underline flex gap-2 items-center text-sm ml-2"
            >
              Saad Mehmood
              <Linkedin className="w-5 h-5 hover:text-white text-[#0077b5]" />
            </Link>
          </div>

          <div className="text-center text-xs mt-6">
            <p>
              &copy; {new Date().getFullYear()} Don Bosco Institute of
              Technology. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Footer;
