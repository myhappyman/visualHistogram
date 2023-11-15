import axios from 'axios';
import { useEffect, useState } from 'react';

interface dangerousHTMLType {
  __html: string;
}

export default function ParsingPage() {
  const [chartHtml, setChartHtml] = useState<dangerousHTMLType>({
    __html: '',
  });

  useEffect(() => {
    axios.get('http://localhost:3001/getFiles').then((res) => {
      if (res?.data) {
        setChartHtml({
          __html: res.data.data,
        });
      }
    });
  }, []);

  return (
    <div className="wrap">
      <h1>아래는 python으로 동작한 결과 html 코드입니다</h1>
      <div dangerouslySetInnerHTML={test()}></div>
      {chartHtml?.__html && <div dangerouslySetInnerHTML={chartHtml}></div>}
      {chartHtml.__html}
    </div>
  );
}

function test() {
  return {
    __html: `
            <html>
                <body>
                    <div id="da_wrap"></div>

                </body>
                <script>
                var a = "<p></p>";
                for(let i=0; i< 10; i++){
                    document.getElementById("da_wrap").append("<p>"+i+"</p>")
                }
                </script>
            </html>
        `,
  };
}
