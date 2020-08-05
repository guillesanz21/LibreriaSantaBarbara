import Link from "next/link";

const Contact = () => {
  console.log("**********RUNNING CONTACT COMPONENT**********");
  return (
    <>
      <Link href="/test">
        <a>Test</a>
      </Link>
      <h1>CONTACT PAGE</h1>
      <p>Do not contact us ever</p>
    </>
  );
};

export default Contact;
