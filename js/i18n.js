window.__I18N__={"dict":{"DenseNet 网络详解：密集连接、Growth Rate 与参数效率":"DenseNet Explained: Dense Connections, Growth Rate, and Parameter Efficiency","密集连接为什么优于加法融合：拼接保留特征的独立性，Growth Rate 则是可控的复杂度节流阀。":"Addition mixes features irreversibly; concatenation keeps every earlier feature available. That one difference explains most of the architecture.","经典网络":"Classic networks","BatchNorm 超详细入门：手算公式、训练与推理差异，以及 BN/LN/IN/GN 怎么选":"BatchNorm Explained in Depth: Manual Calculation, Train vs. Eval, and Choosing BN/LN/IN/GN","从四个数字手算 BatchNorm，图解 NCHW 上的统计范围、gamma/beta、running mean/var、train/eval 模式，并比较 LayerNorm、InstanceNorm 与 GroupNorm，解释小 batch 和医学影像中的选择。":"Calculate BatchNorm from four numbers, see exactly which NCHW elements are normalised together, understand gamma/beta, running mean/variance and train/eval behaviour, and compare BatchNorm, LayerNorm, InstanceNorm and GroupNorm for small-batch medical imaging.","基础概念":"Fundamentals","CS231n 课程笔记：线性分类、反向传播与卷积神经网络":"CS231n Course Notes: Linear Classification, Backpropagation, and Convolutional Neural Networks","线性分类器、损失、优化器、反向传播、初始化、批归一化、卷积、架构演进、迁移学习，以及网络到底学到了什么。":"Linear classifiers, losses, optimisers, backpropagation, initialisation, batch norm, convolution, architecture history, transfer learning and what the network actually learned.","课程笔记":"Course notes","Dice Loss 公式、代码与常见错误：医学图像分割损失函数详解":"Dice Loss: Formula, Code and Common Mistakes in Medical Image Segmentation","Dice Loss 的公式推导、PyTorch 实现，以及 5 个最常见的错误：先阈值再求损失、batch 级与样本级混用、空标注除零、多分类含背景。":"The Dice Loss formula, a PyTorch implementation, and five common mistakes: thresholding before the loss, batch-level vs sample-level, empty masks, and counting background.","医学影像":"Medical imaging","吴恩达机器学习专项课程笔记：回归、分类与神经网络知识地图":"Andrew Ng Machine Learning Specialization Notes: Regression, Classification, and Neural Networks","回归、分类、神经网络、模型评估、决策树、聚类、异常检测、推荐系统、PCA 与强化学习——把整个专项课画成一张彼此相连的地图。":"Regression, classification, neural networks, evaluation, decision trees, clustering, anomaly detection, recommenders, PCA and reinforcement learning — the whole specialization as one connected map.","GFLOPs 怎么计算？卷积层 FLOPs 公式及其与参数量的区别":"How to Calculate GFLOPs: Convolution FLOPs Formula vs. Parameter Count","GFLOPs 到底在数什么：卷积层浮点运算量的推导，以及它和参数量为什么不是一回事。":"Where the number comes from, and why it is not the same thing as parameter count.","MM-UNet AFFM 模块详解：自适应特征融合如何抑制背景噪声":"MM-UNet AFFM Explained: Adaptive Feature Fusion for Suppressing Background Noise","自适应特征融合模块用通道注意力筛选低层细节，再与已经对齐的高层语义特征相加。":"A learned weight per channel, so detail gets through without dragging the background noise along with it.","MM-UNet 论文精读":"MM-UNet paper notes","前列腺 MRI 分割为什么难？CNN、Transformer 与 MM-UNet 对比":"Why Is Prostate MRI Segmentation Difficult? CNN, Transformer, and MM-UNet Compared","前列腺 MRI 分割的研究脉络：CNN 的局部视野、Transformer 的平方复杂度，以及中间那个尚未解决的问题。":"CNNs see too little, Transformers cost too much. The gap between them is where the research question lives.","MM-UNet GCM 模块详解：Mamba 如何建模 3D MRI 全局上下文":"MM-UNet GCM Explained: Modeling Global Context in 3D MRI with Mamba","把 3D 特征体展开为序列，在保留卷积局部能力的同时，用 Mamba 以线性复杂度建模长距离联系。":"Flatten the volume into a sequence and get long-range dependency at linear cost instead of quadratic.","大语言模型（LLM）基础详解：Token、Transformer、RLHF 与 RAG":"Large Language Model Foundations: Tokens, Transformers, RLHF, and RAG","分词、嵌入、注意力、Transformer 块、预训练与规模、指令微调、RLHF、解码、KV 缓存、提示词、LoRA、RAG 与评测。":"Tokenisation, embeddings, attention, the Transformer block, pre-training and scaling, instruction tuning, RLHF, decoding, the KV cache, prompting, LoRA, RAG and evaluation.","MM-UNet MACM 模块详解：多尺度各向异性卷积如何提取 3D 特征":"MM-UNet MACM Explained: Multi-Scale Anisotropic Convolutions for 3D Features","用四个尺度的各向异性卷积分支，同时理解切片内结构与切片间连续性，并控制大卷积核的成本。":"Splitting k×k×k into orthogonal branches cuts roughly 84% of the parameters and fits MR's uneven slice spacing.","医学影像深度学习模型全景：CNN、U-Net、Transformer 与基础模型":"Deep Learning Models for Medical Imaging: CNNs, U-Net, Transformers, and Foundation Models","从骨干网络到分割、检测、生成与基础模型——一张医学影像深度学习的全景地图与发展时间线。":"Backbones, segmentation, detection, generative models and foundation models — plus the timeline that connects them.","MM-UNet 3D Res2Net 编码器详解：2D 权重扩展与多尺度特征提取":"MM-UNet 3D Res2Net Encoder: Expanding 2D Weights for Multi-Scale Feature Extraction","编码器细节：为什么选 Res2Net、2D 权重怎样改造成 3D，以及通道数增长背后的取舍。":"How 2D pretrained weights become a 3D encoder, and why channel count grows as spatial resolution falls.","深度学习模型参数量怎么计算？卷积层与全连接层公式详解":"How to Calculate Deep Learning Model Parameters: Convolutional and Fully Connected Layer Formulas","逐层拆解参数量的计算方式，并解释卷积的参数共享为什么让它比全连接层轻得多。":"Counting weights per layer, and why convolution's weight sharing keeps it so much lighter than a dense layer.","MM-UNet 论文详解：3D MRI 分割架构与 AFFM、GCM、MACM 模块":"MM-UNet Explained: 3D MRI Segmentation with AFFM, GCM, and MACM","MM-UNet 的三个创新点：AFFM 如何过滤噪声、GCM 如何看见全局、MACM 如何适应各向异性分辨率。":"Three modules answering three problems — noisy feature fusion, missing global context, and anisotropic resolution.","Dice、IoU、HD95 医学图像分割评价指标详解：公式、代码与解读误区":"Dice, IoU and HD95: Medical Segmentation Metrics Explained with Formulas and Code","Dice、IoU、精确率、召回率与 HD95 分别衡量什么，如何用 Python 计算，以及体素间距、空预测、2D 与 3D 平均这些最容易出错的细节。":"What Dice, IoU, precision, recall and HD95 each measure, how to compute them in Python, and the details that go wrong: voxel spacing, empty predictions, 2D vs 3D averaging.","SENet 通道注意力详解：Squeeze-and-Excitation 原理与计算过程":"SENet Channel Attention Explained: Squeeze-and-Excitation Principles and Computation","Squeeze-and-Excitation：用全局平均池化加两层全连接，为每个通道学出一个重要性权重。":"Squeeze to a vector, excite through two dense layers, then rescale every channel. A small block that keeps showing up everywhere.","ResNet 残差网络超详细入门：从退化问题到 BasicBlock 与 Bottleneck":"ResNet Explained in Depth: From the Degradation Problem to BasicBlock and Bottleneck","从零理解 ResNet：为什么网络加深后训练误差反而升高，残差 F(x)+x 如何让恒等映射和梯度传播变容易，以及 BasicBlock、Bottleneck、投影捷径与 ResNet-18/50 的结构差异。":"A beginner-friendly guide to ResNet: why training error can rise when a plain network gets deeper, how F(x)+x makes identity mappings and gradient flow easier, and how BasicBlock, Bottleneck and projection shortcuts differ in ResNet-18 and ResNet-50.","U-Net 结构详解：编码器、跳跃连接与解码器如何做医学图像分割":"U-Net Explained: Encoder, Skip Connections and Decoder for Medical Image Segmentation","U-Net 为什么是医学图像分割的起点：编码器压缩语义、解码器恢复分辨率，跳跃连接把边界细节送回来，以及 3D U-Net 与 nnU-Net 的演化。":"Why U-Net is where medical segmentation starts: the encoder compresses meaning, the decoder restores resolution, skip connections bring boundary detail back — plus 3D U-Net and nnU-Net.","图像分割方法对比：Otsu 阈值、Sobel/Canny 边缘检测与机器学习":"Image Segmentation Methods Compared: Otsu Thresholding, Sobel/Canny Edges, and Machine Learning","阈值分割、边缘检测与机器学习三类方法的原理、代价与适用场景对比。":"Three ways to pull structure out of an image, what each one assumes, and what each one costs.","上采样与转置卷积超详细入门：插值、尺寸公式、棋盘格与 U-Net 解码器":"Upsampling and Transposed Convolution in Depth: Interpolation, Output Size, Checkerboards and U-Net Decoders","从像素网格手算最近邻与双线性插值，拆解转置卷积的散射相加、完整输出尺寸公式和 output_padding，图解棋盘格伪影，并给出 U-Net 解码器的选型与尺寸排错方法。":"Calculate nearest-neighbour and bilinear interpolation on pixel grids, understand scatter-add transposed convolution, the complete output-size formula and output_padding, see why checkerboard artifacts occur, and debug U-Net decoder shapes.","论文与综述":"Papers and overviews","计算机视觉":"Computer vision","卷积神经网络":"CNN","归一化":"Normalisation","反向传播":"Backpropagation","医学图像分割":"Medical image segmentation","损失函数":"Loss functions","机器学习":"Machine learning","强化学习":"Reinforcement learning","模型复杂度":"Model complexity","注意力机制":"Attention","特征融合":"Feature fusion","前列腺 MRI":"Prostate MRI","大模型":"Large language models","基础模型":"Foundation models","评价指标":"Evaluation metrics","残差网络":"Residual networks","边缘检测":"Edge detection","上采样":"Upsampling","框架":"Framework","主题":"Theme","复制成功":"Copy Successful","复制失败":"Copy Failed","浏览器不支持":"Browser Not Supported","全部文章":"All Articles","标签":"Tags","分类":"Categories","归档":"Archives","条评论":"comments","无标题":"Untitled","发表于":"Created","更新于":"Updated","总字数":"Word Count","阅读时长":"Reading Time","分钟":"mins","浏览量":"Post Views","评论数":"Comments","文章作者":"Author","文章链接":"Link","版权声明":"Copyright Notice","相关推荐":"Related Articles","编辑":"Edit","返回首页":"Back to Home","搜索":"Search","数据加载中":"Loading Database","搜索文章":"Search for Posts","未找到符合您查询的内容：":"No results found for:","条结果，耗时":"results found in","毫秒":"ms","篇文章":"articles found","上一篇":"Previous","下一篇":"Next","评论":"Comments","文章":"Articles","公告":"Announcement","最新文章":"Recent Posts","网站信息":"Website Info","文章数目":"Article Count","运行时间":"Runtime","天":"days","最后更新时间":"Last Update","本站总字数":"Total Word Count","独立访客":"Unique Visitors","页面浏览":"Page Views","查看更多":"View More","最新评论":"Latest Comments","加载中...":"Loading...","无法获取评论，请确认相关配置是否正确":"Unable to retrieve comments, please check the configuration","暂无评论":"No comments","图片":"Image","链接":"Link","代码":"Code","目录":"Table of Contents","系列文章":"Post Series","刚刚":"Just now","赞助":"Sponsor","分享":"Share","阅读模式":"Reading Mode","简繁转换":"Toggle Between Traditional and Simplified Chinese","日间和夜间模式切换":"Toggle Between Light and Dark Mode","回到顶部":"Back to Top","前往评论":"Scroll to Comments","设置":"Settings","单栏和双栏切换":"Toggle Between Single-column and Double-column","聊天":"Chat","作者":"Author","来源":"Source","著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。":"Copyright belongs to the author. For commercial use, please contact the author for authorization. For non-commercial use, please indicate the source.","已切换为繁体中文":"You have switched to Traditional Chinese","已切换为简体中文":"You have switched to Simplified Chinese","已切换为深色模式":"You have switched to Dark Mode","已切换为浅色模式":"You have switched to Light Mode","加载更多":"Load More","页面未找到":"Page Not Found","首页":"Home","列表":"List","音乐":"Music","电影":"Movies","友链":"Links","关于":"About","反馈":"Feedback","星图":"Map","主题星座":"Topic constellation","知识库":"Library","搜索标题、摘要和标签":"Search titles, summaries and tags","清除标签":"Clear tag","未分类":"Uncategorized","研究索引":"Research index","最新笔记":"Latest notes","核心标签":"Key tags","在星图中查看":"View on the map","在主题星座中查看":"View the topic constellation","最后更新":"Last updated","展开或收起索引":"Show or hide the index","按年份浏览":"By year","热门标签":"Popular tags","持续记录中":"Still writing","切换夜间模式":"Toggle dark mode","返回":"Back","搜索标题、摘要和正文":"Search titles, summaries and text","选择":"Select","打开":"Open","关闭":"Close","探索笔记":"Explore notes","笔记关系图":"Map of notes","阅读轨迹":"Reading trail","Soong 的标签页":"Soong's tags","看看 Soong 的博客里有什么":"What's on Soong's blog","友情链接":"Friends","机器学习、深度学习与医学影像笔记":"Notes on Machine Learning, Deep Learning and Medical Imaging","有关机器学习，力扣代码训练等，欢迎探索":"Notes on machine learning, LeetCode practice and more. Welcome!","记录机器学习、深度学习与医学影像的学习笔记。":"Notes on machine learning, deep learning and medical imaging.","系统记录机器学习、深度学习、计算机视觉、医学图像分割与模型结构的学习笔记。":"Study notes on machine learning, deep learning, computer vision, medical image segmentation and model architectures.","本博客所有文章除特别声明外，均采用":"All posts on this blog are licensed under","许可协议。转载请注明来源":"unless stated otherwise. When sharing, please credit","！":".","来看看有什么":"Have a look around","快速、简单且强大的博客框架":"A fast, simple and powerful blog framework","网站":"Websites","值得推荐的网站":"Sites worth a visit","开源平台":"Open-source platform","代码能力联系平台":"Coding practice platform","机器学习与深度学习":"Machine Learning & Deep Learning","欢迎来到 Soong 的学习笔记。右上角可以切换中文 / English。":"Welcome to Soong's study notes. Use the switch at the top right to change between 中文 and English.","MM-UNet 论文精读专题：前列腺 MRI 分割架构阅读路线":"MM-UNet Paper Series: A Reading Path for Prostate MRI Segmentation"},"rules":[["^(\\d+)\\s*分钟前$","$1 minutes ago"],["^(\\d+)\\s*小时前$","$1 hours ago"],["^(\\d+)\\s*天前$","$1 days ago"],["^(\\d+)\\s*个月前$","$1 months ago"],["^一月 (\\d{4})$","January $1"],["^二月 (\\d{4})$","February $1"],["^三月 (\\d{4})$","March $1"],["^四月 (\\d{4})$","April $1"],["^五月 (\\d{4})$","May $1"],["^六月 (\\d{4})$","June $1"],["^七月 (\\d{4})$","July $1"],["^八月 (\\d{4})$","August $1"],["^九月 (\\d{4})$","September $1"],["^十月 (\\d{4})$","October $1"],["^十一月 (\\d{4})$","November $1"],["^十二月 (\\d{4})$","December $1"]]};
/* 中 / EN switch. Loaded after window.__I18N__ (see scripts/i18n.js). */
(function () {
  var I = window.__I18N__ || { dict: {}, rules: [] };
  var KEY = 'site-lang';
  var root = document.documentElement;
  var CJK = /[㐀-鿿＀-￯　-〿]/;
  // Never touched by the translator: article bodies have their own English
  // version, code stays code, and the tag cloud and knowledge map redraw
  // themselves.
  var SKIP = 'script,style,code,pre,textarea,math,.lang-block,.wc-wrap,.lang-toggle,.keep-zh,.mermaid-wrap,.km';
  var ATTRS = ['title', 'aria-label', 'placeholder'];

  var rules = I.rules.map(function (r) { return [new RegExp(r[0]), r[1]]; });
  // Fallback for text that only contains an interface word, e.g. "全部文章 - 30".
  var phrases = Object.keys(I.dict).filter(function (k) { return CJK.test(k) && k.length <= 12; })
    .sort(function (a, b) { return b.length - a.length; });

  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(l) { try { localStorage.setItem(KEY, l); } catch (e) {} }

  var param = new URLSearchParams(location.search).get('lang');
  var lang = param === 'en' || param === 'zh' ? param : (read() === 'en' ? 'en' : 'zh');
  if (param === 'en' || param === 'zh') save(lang);

  function t(text) {
    var s = String(text).trim();
    if (!s) return text;
    var hit = Object.prototype.hasOwnProperty.call(I.dict, s) ? I.dict[s] : undefined;
    if (hit === undefined) {
      for (var i = 0; i < rules.length; i++) {
        if (rules[i][0].test(s)) { hit = s.replace(rules[i][0], rules[i][1]); break; }
      }
    }
    // Only short labels: a long sentence half-translated reads worse than Chinese.
    // "分类 - MM-UNet 论文精读": translate each side.
    if (hit === undefined && s.indexOf(' - ') !== -1) {
      var parts = s.split(' - ').map(function (p) { return t(p); });
      if (parts.join(' - ') !== s) hit = parts.join(' - ');
    }
    // Only short labels: a long sentence half-translated reads worse than Chinese.
    if (hit === undefined && CJK.test(s) && s.length <= 16) {
      var out = s;
      for (var j = 0; j < phrases.length; j++) {
        if (out.indexOf(phrases[j]) !== -1) out = out.split(phrases[j]).join(I.dict[phrases[j]]);
      }
      if (out !== s) hit = out;
    }
    return hit === undefined ? text : String(text).replace(s, hit);
  }

  var original = new WeakMap();
  var skipped = function (el) { return !el || (el.closest && el.closest(SKIP)); };

  function translateTree(node, to) {
    if (node.nodeType === 3) return translateText(node, to);
    if (node.nodeType !== 1 || skipped(node)) return;
    var walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) { return skipped(n.parentElement) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT; }
    });
    var list = [];
    while (walker.nextNode()) list.push(walker.currentNode);
    list.forEach(function (n) { translateText(n, to); });

    var els = [node].concat(Array.prototype.slice.call(node.querySelectorAll('[title],[aria-label],[placeholder]')));
    els.forEach(function (el) {
      if (skipped(el)) return;
      ATTRS.forEach(function (a) {
        if (!el.hasAttribute(a)) return;
        var keep = 'data-i18n-' + a;
        if (!el.hasAttribute(keep)) el.setAttribute(keep, el.getAttribute(a));
        var zh = el.getAttribute(keep);
        el.setAttribute(a, to === 'en' ? t(zh) : zh);
      });
    });
  }

  function translateText(n, to) {
    if (skipped(n.parentElement)) return;
    var zh = original.has(n) ? original.get(n) : n.nodeValue;
    if (to === 'en') {
      var en = t(zh);
      if (en !== zh) { original.set(n, zh); if (n.nodeValue !== en) n.nodeValue = en; }
    } else if (original.has(n) && n.nodeValue !== zh) {
      n.nodeValue = zh;
    }
  }

  var docTitle = document.title;
  function translateTitle(to) {
    document.title = to === 'en'
      ? docTitle.split(/( \| | - )/).map(function (p) { return /^( \| | - )$/.test(p) ? p : t(p); }).join('')
      : docTitle;
  }

  // Table of contents: each entry belongs to the language of its heading, and
  // numbering restarts per language.
  function setupToc() {
    var toc = document.querySelector('#card-toc .toc-content');
    if (!toc) return;
    toc.querySelectorAll('.toc-link').forEach(function (a) {
      var id = decodeURIComponent((a.getAttribute('href') || '').slice(1));
      var h = id && document.getElementById(id);
      var block = h && h.closest('.lang-block');
      if (block) a.parentNode.setAttribute('data-lang', block.getAttribute('data-lang'));
    });
    ['zh', 'en'].forEach(function (l) { number(toc, l, ''); });
  }
  // Hexo's toc can leave top-level <li>s outside the <ol> when heading levels
  // are mixed, so collect the entries of a level across both.
  function items(list) {
    var out = [];
    Array.prototype.forEach.call(list.children, function (c) {
      if (c.tagName === 'LI') out.push(c);
      else if (c.tagName === 'OL') out = out.concat(items(c));
    });
    return out;
  }
  function number(list, l, prefix) {
    var i = 0;
    items(list).forEach(function (li) {
      if (li.getAttribute('data-lang') !== l) return;
      var num = prefix + (++i) + '.';
      li.setAttribute('data-num-' + l, num);
      var sub = li.querySelector(':scope > ol');
      if (sub) number(sub, l, num);
    });
  }
  function renumberToc(to) {
    document.querySelectorAll('#card-toc li[data-num-' + to + ']').forEach(function (li) {
      var span = li.querySelector(':scope > a .toc-number');
      if (span) span.textContent = li.getAttribute('data-num-' + to);
    });
  }

  var button;
  function addButton() {
    var host = document.getElementById('menus') || document.getElementById('nav');
    if (!host) return;
    button = document.createElement('button');
    button.type = 'button';
    button.className = 'lang-toggle';
    button.innerHTML = '<span data-l="zh">中</span><span data-l="en">EN</span>';
    button.addEventListener('click', function () {
      lang = lang === 'en' ? 'zh' : 'en';
      save(lang);
      apply();
    });
    host.insertBefore(button, document.getElementById('toggle-menu'));
  }

  function apply() {
    root.setAttribute('data-lang', lang);
    root.setAttribute('lang', lang === 'en' ? 'en' : 'zh-CN');
    translateTree(document.body, lang);
    translateTitle(lang);
    renumberToc(lang);
    if (button) {
      button.setAttribute('aria-label', lang === 'en' ? '切换到中文' : 'Switch to English');
      button.title = button.getAttribute('aria-label');
    }
    document.dispatchEvent(new CustomEvent('site-lang-change', { detail: { lang: lang } }));
  }

  window.siteI18n = { lang: function () { return lang; }, t: t };

  function init() {
    addButton();
    setupToc();
    apply();
    // Text the theme adds later (relative dates, visitor counts, lazy widgets).
    new MutationObserver(function (records) {
      if (lang !== 'en') return;
      records.forEach(function (r) {
        Array.prototype.forEach.call(r.addedNodes, function (n) { translateTree(n, 'en'); });
      });
    }).observe(document.body, { childList: true, subtree: true });
    window.addEventListener('load', function () { if (lang === 'en') translateTree(document.body, 'en'); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
