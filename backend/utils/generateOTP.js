import Randomstring from "randomstring";

const generateOTP = () => {
    return Randomstring.generate({ length: 6, charset: 'numeric' });
}

export default generateOTP;
