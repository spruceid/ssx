import { ReactNode } from "react";

interface ITitle {
  title: ReactNode,
  subtitle: ReactNode,
}

const Title = ({ title, subtitle }: ITitle) => {
  return <div className='Title'>
    <h1 className='Title-h1'>
      {title}
    </h1>
    <h2 className='Title-h2'>
      {subtitle}
    </h2>
  </div>
};

export default Title;