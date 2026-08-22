import chatbotLogo from '../../assets/images/chabotLogo1.png';
import '../../styles/NovaMark.css';

export default function NovaMark({ size = 40 }: { size?: number }) {
  return (
    <div className="nova-mark">
      <span className="nova-mark__text">NOVA</span>
      <img src={chatbotLogo} alt="" style={{ width: size, height: size }} className="nova-mark__icon" />
    </div>
  );
}