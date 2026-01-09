/*
Copyright (C) 2025 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/

import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Typography,
  Input,
  ScrollList,
  ScrollItem,
} from '@douyinfe/semi-ui';
import { API, showError, copy, showSuccess } from '../../helpers';
import { useIsMobile } from '../../hooks/common/useIsMobile';
import { API_ENDPOINTS } from '../../constants/common.constant';
import { StatusContext } from '../../context/Status';
import { useActualTheme } from '../../context/Theme';
import { marked } from 'marked';
import { useTranslation } from 'react-i18next';
import {
  IconGithubLogo,
  IconPlay,
  IconFile,
  IconCopy,
  IconUser, // 代表注册
  IconKey, // 代表令牌
  IconSetting, // 代表配置
  IconGift, // 代表福利/兑换码
  IconBookStroked, // 代表教程
} from '@douyinfe/semi-icons';
import { Link } from 'react-router-dom';
import NoticeModal from '../../components/layout/NoticeModal';
import {
  Moonshot,
  OpenAI,
  XAI,
  Zhipu,
  Volcengine,
  Cohere,
  Claude,
  Gemini,
  Suno,
  Minimax,
  Wenxin,
  Spark,
  Qingyan,
  DeepSeek,
  Qwen,
  Midjourney,
  Grok,
  AzureAI,
  Hunyuan,
  Xinference,
} from '@lobehub/icons';
import { Weight } from 'lucide-react';

const { Text } = Typography;

const Home = () => {
  const { t, i18n } = useTranslation();
  const [statusState] = useContext(StatusContext);
  const actualTheme = useActualTheme();
  const [homePageContentLoaded, setHomePageContentLoaded] = useState(false);
  const [homePageContent, setHomePageContent] = useState('');
  const [noticeVisible, setNoticeVisible] = useState(false);
  const isMobile = useIsMobile();
  const isDemoSiteMode = statusState?.status?.demo_site_enabled || false;
  const docsLink = statusState?.status?.docs_link || '';
  const serverAddress =
    statusState?.status?.server_address || `${window.location.origin}`;
  const endpointItems = API_ENDPOINTS.map((e) => ({ value: e }));
  const [endpointIndex, setEndpointIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setEndpointIndex((prev) => (prev + 1) % endpointItems.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [endpointItems.length]);

  const isChinese = i18n.language.startsWith('zh');

  const displayHomePageContent = async () => {
    setHomePageContent(localStorage.getItem('home_page_content') || '');
    const res = await API.get('/api/home_page_content');
    const { success, message, data } = res.data;
    if (success) {
      let content = data;
      if (!data.startsWith('https://')) {
        content = marked.parse(data);
      }
      setHomePageContent(content);
      localStorage.setItem('home_page_content', content);

      // 如果内容是 URL，则发送主题模式
      if (data.startsWith('https://')) {
        const iframe = document.querySelector('iframe');
        if (iframe) {
          iframe.onload = () => {
            iframe.contentWindow.postMessage({ themeMode: actualTheme }, '*');
            iframe.contentWindow.postMessage({ lang: i18n.language }, '*');
          };
        }
      }
    } else {
      showError(message);
      setHomePageContent('加载首页内容失败...');
    }
    setHomePageContentLoaded(true);
  };

  const handleCopyBaseURL = async () => {
    const ok = await copy(serverAddress);
    if (ok) {
      showSuccess(t('已复制到剪切板'));
    }
  };

  useEffect(() => {
    const checkNoticeAndShow = async () => {
      const lastCloseDate = localStorage.getItem('notice_close_date');
      const today = new Date().toDateString();
      if (lastCloseDate !== today) {
        try {
          const res = await API.get('/api/notice');
          const { success, data } = res.data;
          if (success && data && data.trim() !== '') {
            setNoticeVisible(true);
          }
        } catch (error) {
          console.error('获取公告失败:', error);
        }
      }
    };

    checkNoticeAndShow();
  }, []);

  useEffect(() => {
    displayHomePageContent().then();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setEndpointIndex((prev) => (prev + 1) % endpointItems.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [endpointItems.length]);

  const sushiList = [
    { name: 'Sushi 1', src: '/sushi/1.png' },
    { name: 'Sushi 2', src: '/sushi/2.png' },
    { name: 'Sushi 3', src: '/sushi/3.png' },
    { name: 'Sushi 4', src: '/sushi/4.png' },
    { name: 'Sushi 5', src: '/sushi/5.png' },
    { name: 'Sushi 6', src: '/sushi/6.png' },
    { name: 'Sushi 7', src: '/sushi/7.png' },
    { name: 'Sushi 8', src: '/sushi/8.png' },
    { name: 'Sushi 9', src: '/sushi/9.png' },
    { name: 'Sushi 10', src: '/sushi/10.png' },
  ];

  return (
    <>
      {/* 1. 全局背景图 (放在最外层) */}
      <div className='home-background'></div>

      <div className='w-full overflow-x-hidden min-h-screen flex flex-col'>
        <NoticeModal
          visible={noticeVisible}
          onClose={() => setNoticeVisible(false)}
          isMobile={isMobile}
        />

        {homePageContentLoaded && homePageContent === '' ? (
          <div className='flex flex-col items-center justify-center flex-grow px-4 py-20 relative'>
            {/* 2. 毛玻璃方圆框容器 START */}
            <div className='glass-panel flex flex-col items-center justify-center text-center px-4 py-8 md:px-10'>
              {/* --- A. 标题区域 --- */}
              <h1
                className={`text-3xl md:text-5xl font-bold text-semi-color-text-0 mb-4 ${isChinese ? 'tracking-wide' : ''}`}
              >
                {t('欢迎来到')}{' '}
                <span className='shine-text'>{t('寿司喵API站')}</span>
              </h1>

              {/* --- B. 新站开业福利 (Banner) --- */}
              <div
                className='mt-2 mb-6 rounded-xl p-4 w-full max-w-xl shadow-lg transition-transform hover:scale-[1.01]'
                style={{
                  // 强制使用暖色渐变背景 (浅琥珀色 -> 浅橘色)
                  background:
                    'linear-gradient(to right, rgba(238, 68, 68, 0.65), rgba(253, 226, 116, 0.5))',
                  backdropFilter: 'blur(12px)',
                  border: 'none',
                }}
              >
                <div className='flex flex-col gap-2 text-sm md:text-base font-medium text-semi-color-text-0'>
                  {/* 第一行：标题 */}
                  <p className='flex items-center justify-center gap-2'>
                    <span className='text-xl'>🎉</span>
                    新站开业：注册即送{' '}
                    <span
                      style={{
                        color: '#ffffff',
                        fontSize: '1.125rem',
                        fontWeight: 800,
                        textShadow: '0 1px 2px rgba(0,0,0,0.2)', // 加点阴影让白字更清晰
                      }}
                    >
                      ￥2
                    </span>{' '}
                    饭票！
                  </p>

                  {/* 第二行：邀请提示 */}
                  <p className='flex items-center justify-center gap-2 opacity-80 text-xs md:text-sm'>
                    🤝 邀请好友注册，双方均可获得额外奖励
                  </p>

                  {/* 第三行：交流群 (修改部分：包裹在 div 中，强制横向排列) */}
                  <div className='flex items-center justify-center gap-1 mt-1'>
                    <span className='text-gray-900 font-bold opacity-90'>
                      食堂通知&交流群：
                    </span>
                    <a
                      href='https://qm.qq.com/q/iN9nEEulk6'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='group flex items-center gap-1 font-black text-purple-800 hover:text-purple-600 transition-colors'
                      style={{
                        textDecoration: 'underline',
                        textUnderlineOffset: '4px',
                      }} // 显眼的下划线
                      title='点击加入群聊'
                    >
                      1079617011
                      {/* 增加一个小手指图标，提示可点击 */}
                    </a>
                    <span className='group-hover:-translate-y-1 transition-transform'>
                      👈
                    </span>
                  </div>
                </div>
              </div>

              {/* --- C. 核心按钮组 --- */}
              <div className='flex flex-wrap gap-4 justify-center w-full mb-10'>
                <Link to='/register'>
                  <Button
                    theme='solid'
                    type='primary'
                    size='large'
                    /* 修改 1：在这里添加了 icon 属性 */
                    icon={<IconUser />}
                    className='!rounded-2xl px-12 h-12 text-lg font-bold shadow-lg hover:-translate-y-1 transition-transform duration-300'
                    style={{
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    }}
                  >
                    {t('食客注册')}
                  </Button>
                </Link>

                <Button
                  theme='solid'
                  size='large'
                  icon={<IconGift />}
                  className='!rounded-2xl px-8 h-12 text-lg shadow-md hover:-translate-y-1 transition-transform duration-300'
                  style={{
                    background: 'rgba(234, 162, 29, 0.77)',
                    border: '1px solid rgba(255,255,255,0.6)',
                    color: '#ffffffff',
                    fontWeight: 'bold',
                  }}
                  onClick={() => window.open('/console/topup', '_blank')}
                >
                  {t('饭卡充值')}
                </Button>
              </div>

              {/* URL 地址标题 */}
              <p className='text-sm text-semi-color-text-0 opacity-80 mb-2 text-left w-full max-w-md pl-4 font-bold'>
                {t('URL地址（OpenAI格式）:')}
              </p>

              {/* URL 输入框容器 */}
              {/* 修改 2：在这里添加了 mb-12，拉开与下方“用餐指南”的距离 */}
              <div className='w-full max-w-md mb-12'>
                <Input
                  readonly
                  value={serverAddress + '/v1'}
                  className='!rounded-full custom-home-input'
                  size='large'
                  style={{
                    background: '#8a5cf6af',
                    border: '1px solid rgba(255, 255, 255, 1)',
                    boxShadow: '0 4px 12px rgba(138, 92, 246, 0.2)',
                  }}
                  suffix={
                    <div className='flex items-center gap-2'>
                      <Button
                        theme='solid'
                        type='tertiary'
                        onClick={() => {
                          copy(serverAddress + '/v1');
                          showSuccess(t('已复制到剪切板'));
                        }}
                        icon={<IconCopy />}
                        className='!rounded-full'
                        style={{
                          marginRight: 2,
                          background: 'rgba(255,255,255,0.2)',
                          color: 'white',
                        }}
                      />
                    </div>
                  }
                />
              </div>

              {/* --- D. 快速上手 (Workflow) --- */}
              <div className='w-full max-w-3xl mb-8'>
                {/* 标题栏 */}
                <div className='flex justify-between items-center mb-6 px-4'>
                  <h3 className='text-xl font-bold text-semi-color-text-0 flex items-center gap-3'>
                    <img
                      src='/claw.png'
                      alt='claw'
                      className='w-8 h-8 drop-shadow-sm'
                    />
                    用餐指南
                  </h3>
                  <Button
                    theme='borderless'
                    type='primary'
                    icon={<IconBookStroked />}
                    style={{
                      color: 'var(--semi-color-text-0)',
                      background: 'rgba(255,255,255,0.3)',
                    }}
                    onClick={() =>
                      window.open('https://your-feishu-doc-link.com', '_blank')
                    }
                  >
                    宝宝辅食
                  </Button>
                </div>

                {/* 三步走流程图 */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  {/* Step 1: 注册账号 (靛青色背景) */}
                  <div
                    className='relative rounded-2xl p-6 flex flex-col items-center shadow-lg transition-all group'
                    style={{
                      background: 'rgba(48, 117, 213, 0.6)', // 靛青色 Indigo
                      backdropFilter: 'blur(12px)',
                      color: 'white', // 强制文字白色
                    }}
                  >
                    <div
                      className='w-14 h-14 rounded-full flex items-center justify-center mb-3 shadow-inner group-hover:scale-110 transition-transform'
                      style={{ background: 'rgba(255,255,255,0.2)' }}
                    >
                      <IconUser size='large' style={{ color: 'white' }} />
                    </div>
                    <div
                      className='font-bold text-lg'
                      style={{ color: 'white' }}
                    >
                      食客注册
                    </div>
                    <div
                      className='text-sm opacity-90 mt-1'
                      style={{ color: 'rgba(255,255,255,0.9)' }}
                    >
                      领取饭票~
                    </div>
                  </div>

                  {/* Step 2: 生成令牌 (紫色背景) */}
                  <div
                    className='relative rounded-2xl p-6 flex flex-col items-center shadow-lg transition-all group'
                    style={{
                      background: 'rgba(166, 51, 179, 0.58)', // 紫色 Purple
                      backdropFilter: 'blur(12px)',
                      color: 'white',
                    }}
                  >
                    <div
                      className='w-14 h-14 rounded-full flex items-center justify-center mb-3 shadow-inner group-hover:scale-110 transition-transform'
                      style={{ background: 'rgba(255,255,255,0.2)' }}
                    >
                      <IconKey size='large' style={{ color: 'white' }} />
                    </div>
                    <div
                      className='font-bold text-lg'
                      style={{ color: 'white' }}
                    >
                      领取饭卡
                    </div>
                    <div
                      className='text-sm opacity-90 mt-1'
                      style={{ color: 'rgba(255,255,255,0.9)' }}
                    >
                      创建 API Token
                    </div>
                  </div>

                  {/* Step 3: 客户端配置 (粉色背景) */}
                  <div
                    className='relative rounded-2xl p-6 flex flex-col items-center shadow-lg transition-all group'
                    style={{
                      background: 'rgba(45, 166, 77, 0.71)', // 粉色 Pink
                      backdropFilter: 'blur(12px)',
                      color: 'white',
                    }}
                  >
                    <div
                      className='w-14 h-14 rounded-full flex items-center justify-center mb-3 shadow-inner group-hover:scale-110 transition-transform'
                      style={{ background: 'rgba(255,255,255,0.2)' }}
                    >
                      <IconSetting size='large' style={{ color: 'white' }} />
                    </div>
                    <div
                      className='font-bold text-lg'
                      style={{ color: 'white' }}
                    >
                      开始干饭
                    </div>
                    <div
                      className='text-sm opacity-90 mt-1'
                      style={{ color: 'rgba(255,255,255,0.9)' }}
                    >
                      填写 URL 和 Token
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* 2. 毛玻璃方圆框容器 END */}

            {/* 3. 寿司图标区域 */}
            <div className='mt-8 w-full max-w-4xl'>
              <div className='text-center mb-6'>
                <Text
                  type='primary'
                  className='text-xl font-bold'
                  style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                >
                  {t('欢迎品尝！！')}
                </Text>
              </div>

              {/* 图标网格 */}
              <div className='flex flex-wrap items-center justify-center gap-6 md:gap-8'>
                {sushiList.map((item, index) => (
                  <div
                    key={index}
                    title={item.name}
                    className='transition-all duration-300 hover:-translate-y-2'
                  >
                    {/* 这里引用你的本地寿司图片 */}
                    <img
                      src={item.src}
                      alt={item.name}
                      className='sushi-icon'
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // 这里是加载自定义 HTML 的逻辑，保持不变，但加了容器防止背景错乱
          <div className='w-full min-h-screen'>
            {homePageContent.startsWith('https://') ? (
              <iframe
                src={homePageContent}
                className='w-full h-screen border-none'
              />
            ) : (
              <div
                className='mt-[60px] p-4 glass-panel mx-auto'
                dangerouslySetInnerHTML={{ __html: homePageContent }}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
