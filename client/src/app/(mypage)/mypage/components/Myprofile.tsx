"use client";

const Myprofile = () => {
  // const [userInfo, setUserInfo] = useState<UserInfo | null>(null); // 사용자 정보를 상태로 관리
  // const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const accessToken = sessionStorage.getItem("accessToken");

  return (
    <>
      <section className="typo-title mb-5 flex items-end justify-between">
        <div className="flex items-end">
          <div>
            <p>My</p>
            <p>Profile</p>
          </div>
        </div>
      </section>
      <div>accessToken: {accessToken}</div>
    </>
  );
};

export default Myprofile;
