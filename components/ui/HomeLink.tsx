// HomeLink 컴포넌트
import Link from "next/link";

const HomeLink = () => {
  return (
    <Link href="/">
      <div>
        <h1 className="text-white">홈으로</h1>
      </div>
    </Link>
  );
};

export default HomeLink;
