package com.bghuan.fantasy;

import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends AppCompatActivity {
    private WebView webView;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        webView = findViewById(R.id.fullscreen_content);
        webView.post(mHidePart2Runnable);

        webView.loadUrl("https://www.buguoheng.com"); // 加载url

        webView.setWebViewClient(webViewClient);

        WebSettings webSettings = webView.getSettings();

        webSettings.setJavaScriptEnabled(true); // 允许使用js
        webSettings.setDomStorageEnabled(true); // LocalStroage
    }

    //    设置状态栏文字颜色为黑
    private final Runnable mHidePart2Runnable = new Runnable() {
        @SuppressLint("InlinedApi")
        @Override
        public void run() {
            webView.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
        }
    };

    //    webView监听url跳转事件
    private WebViewClient webViewClient = new WebViewClient() {
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            return super.shouldOverrideUrlLoading(view, request);
        }
    };

    //    webView监听返回事件
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (webView.canGoBack() && keyCode == KeyEvent.KEYCODE_BACK) {
            webView.goBack();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }
}