import './Header.css';

function Header({ onClickCreateStudy }) {
  return (
    <header className="header">
      <div className="header__inner">
        <img
          src="/img_logo.png" // 공부의 숲 로고
          alt="공부의 숲"
          className="header__logo"
        />

        <button
          className="header__cta" // 스터디 만들기 버튼
          onClick={onClickCreateStudy}
        >
          스터디 만들기
        </button>
      </div>
    </header>
  );
}

export default Header;
