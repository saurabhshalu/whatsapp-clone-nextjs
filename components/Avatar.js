const Avatar = ({ photoURL, email = "S" }) => {
  return !photoURL ? (
    <div className="h-12 p-5 bg-yellow-50 rounded-full text-black flex justify-center items-center m-2">
      {email[0].toUpperCase()}
    </div>
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={photoURL} alt={email} className="h-12 rounded-full m-2" />
  );
};

export default Avatar;
