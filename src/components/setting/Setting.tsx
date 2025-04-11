import { useEffect, useRef, useState } from "react";

import CheckboxNew from "../checkbox/CheckboxNew";
import CustomSelectSearch from "../select/CustomSelectSearch";
import DividerY from "../Divider/DividerY";
import { t } from "i18next";
import { useSearchParams } from "react-router-dom";

const Setting = () => {
  /** Mock Ngôn ngữ */
  const LANGUAGES = [
    { key: t("page_setting"), value: "auto" },
    { key: t("vietnamese"), value: "vi" },
    { key: t("english"), value: "en" },
    { key: t("korean"), value: "kr" },
    { key: t("japanese"), value: "jp" },
    { key: t("chinese"), value: "cn" },
  ];
  /**
   * Lấy thông tin từ URL
   */
  const [search_params] = useSearchParams();

  /** Thêm locale từ localStorage */
  const LOCALE = localStorage.getItem("locale") || "vi";

  /**
   * Ngôn ngữ
   */
  const [locale, setLocale] = useState<string | number>(LOCALE);
  /**
   * IFrame
   */
  const IFRAME_REF = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    /**
     * Gọi hàm Interval
     */
    const INTERVAL = setInterval(() => {
      /**
       * Lấy iframe
       */
      const IFRAME = document.querySelector(
        "#BBH-EMBED-IFRAME"
      ) as HTMLIFrameElement | null;
      /**
       *  Nếu có Iframe thì gán vào ref
       */
      if (IFRAME) {
        IFRAME_REF.current = IFRAME;
        clearInterval(INTERVAL); // Ngừng khi đã tìm thấy iframe
      }
    }, 300); // Kiểm tra mỗi 300ms

    return () => clearInterval(INTERVAL);
  }, []);

  /**
   * Access token từ URL hoặc localStorage
   */
  const PAGE_ID = search_params.get("page_id");

  /** Hàm confirm */
  const handleReset = () => {
    /** Gửi message xuống SDK */
    if (IFRAME_REF?.current?.contentWindow) {
      IFRAME_REF.current?.contentWindow.postMessage(
        {
          from: "parent-app-preview",
          reset_conversation: true,
          reset_page_id: PAGE_ID,
        },
        "*"
      );
    }
  };
  /** Hàm confirm */
  const handleChangeLanguage = (locale: any) => {
    /** Lưu locale vào localStorage */
    localStorage.setItem("locale", locale.toString());
    setLocale(locale);
    /** Gửi message xuống SDK */
    if (IFRAME_REF?.current?.contentWindow) {
      IFRAME_REF.current?.contentWindow.postMessage(
        {
          from: "parent-app-preview",
          locale: locale,
          reset_page_id: PAGE_ID,
        },
        "*"
      );
    }
  };
  return (
    <div className="flex h-full w-full">
      <div className="flex flex-col gap-y-2 p-4 border bg-white border-gray-300 md:rounded-lg w-full md:w-1/2">
        {/* <div className="flex flex-shrink-0 h-10 justify-end w-full">
          <button
            onClick={() => {
              handleConfirm();

              setResetConversation(false);
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {t("save")}
          </button>
        </div> */}
        {/* <DividerY /> */}
        <div className="flex flex-col gap-y-4">
          <button
            onClick={() => {
              handleReset();
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-60"
          >
            {t("simulate_conversation")}
          </button>
          {/* <DividerY /> */}
          <div className="flex gap-y-2 gap-x-4 items-center">
            <span className="text-sm font-medium flex-shrink-0 ">
              {t("language")}
            </span>
            <div className="w-full md:max-w-60">
              <CustomSelectSearch
                label={t("language")}
                data={LANGUAGES}
                selected={LANGUAGES.find((e) => e.value === locale)}
                value={locale}
                setSelected={(e) => {
                  handleChangeLanguage(e.value);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
