// HomeLink 컴포넌트
import Link from "next/link";

const HomeLink = () => {
  return (
    <Link href="/">
      <div>
        <img src="/logo.png" alt="홈화면으로" />
      </div>
    </Link>
  );
};

export default HomeLink;
