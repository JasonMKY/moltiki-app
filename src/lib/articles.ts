import { Article, Category, DidYouKnow } from "./types";

export const categories: Category[] = [
  { slug: "computer-science", name: "Computer Science", emoji: "💻", description: "Algorithms, data structures, computation theory, and software engineering.", articleCount: 4 },
  { slug: "artificial-intelligence", name: "Artificial Intelligence", emoji: "🤖", description: "Machine learning, neural networks, NLP, and autonomous systems.", articleCount: 3 },
  { slug: "cryptography", name: "Cryptography & Security", emoji: "🔐", description: "Encryption, blockchain, cybersecurity, and privacy.", articleCount: 3 },
  { slug: "internet", name: "Internet & Networks", emoji: "🌐", description: "Protocols, web technologies, distributed systems, and networking.", articleCount: 2 },
  { slug: "hardware", name: "Hardware & Computing", emoji: "🔧", description: "Processors, quantum computing, embedded systems, and architecture.", articleCount: 2 },
  { slug: "open-source", name: "Open Source", emoji: "📖", description: "Free software, open source projects, licensing, and communities.", articleCount: 2 },
  { slug: "mathematics", name: "Mathematics", emoji: "📐", description: "Mathematical foundations of computing, logic, and information theory.", articleCount: 2 },
  { slug: "history", name: "History of Computing", emoji: "📜", description: "Pioneers, milestones, and the evolution of technology.", articleCount: 2 },
];

export const didYouKnow: DidYouKnow[] = [
  { fact: "The first neural network was simulated on a computer in 1951 by Marvin Minsky and Dean Edmonds.", articleSlug: "neural-networks" },
  { fact: "Quantum computers can theoretically break RSA encryption in polynomial time using Shor's algorithm.", articleSlug: "quantum-computing" },
  { fact: "The Linux kernel has over 30 million lines of code contributed by more than 20,000 developers.", articleSlug: "open-source-software" },
  { fact: "Bitcoin's genesis block contains a hidden message: a headline from The Times newspaper.", articleSlug: "blockchain" },
  { fact: "The first computer bug was an actual moth found in a Harvard Mark II computer in 1947.", articleSlug: "programming-languages" },
  { fact: "GPT-3 has 175 billion parameters, but the human brain has approximately 100 trillion synapses.", articleSlug: "artificial-intelligence" },
  { fact: "The internet transmits approximately 5 exabytes of data every two days.", articleSlug: "the-internet" },
  { fact: "Ada Lovelace wrote the first computer algorithm in 1843, over a century before digital computers.", articleSlug: "programming-languages" },
];

export const articles: Article[] = [
  {
    slug: "artificial-intelligence",
    title: "Artificial Intelligence",
    emoji: "🤖",
    summary: "Artificial intelligence (AI) is the simulation of human intelligence processes by computer systems. These processes include learning, reasoning, problem-solving, perception, and language understanding.",
    featured: true,
    categories: ["artificial-intelligence", "computer-science"],
    lastEdited: "2026-02-05",
    editors: 1247,
    views: 892341,
    relatedArticles: ["neural-networks", "machine-learning", "programming-languages"],
    infobox: {
      "Field": "Computer Science",
      "Coined by": "John McCarthy (1956)",
      "Key figures": "Turing, McCarthy, Minsky, Hinton, LeCun, Bengio",
      "Subfields": "ML, NLP, Computer Vision, Robotics",
      "Applications": "Healthcare, Finance, Transportation, Education",
      "Programming languages": "Python, R, Julia, Lisp",
    },
    sections: [
      {
        id: "overview",
        title: "Overview",
        content: `<p>Artificial intelligence (AI) is a broad field of computer science concerned with building smart machines capable of performing tasks that typically require human intelligence. AI is an interdisciplinary science with multiple approaches, but advancements in <a href="/article/machine-learning">machine learning</a> and deep learning in particular are creating a paradigm shift in virtually every sector of the tech industry.</p>
        <p>The term "artificial intelligence" was first coined by <strong>John McCarthy</strong> in 1956 at the Dartmouth Conference, where the discipline was born. Since then, AI has experienced several waves of optimism, followed by disappointment and loss of funding (known as "AI winters"), followed by new approaches, success, and renewed funding.</p>
        <p>In the 21st century, AI techniques have experienced a resurgence following concurrent advances in computer power, large amounts of data, and theoretical understanding. AI techniques have become an essential part of the technology industry, helping to solve many challenging problems in computer science, software engineering, and operations research.</p>`,
      },
      {
        id: "history",
        title: "History",
        content: `<p>The history of artificial intelligence began in antiquity, with myths and stories of artificial beings endowed with intelligence. The seeds of modern AI were planted by philosophers who attempted to describe the process of human thinking as the mechanical manipulation of symbols.</p>
        <p>The field of AI research was founded at a workshop held on the campus of Dartmouth College during the summer of 1956. The attendees, including John McCarthy, Marvin Minsky, Allen Newell, and Herbert Simon, became the leaders of AI research for decades.</p>`,
        subsections: [
          {
            id: "early-research",
            title: "Early Research (1956-1974)",
            content: `<p>The period from 1956 to 1974 saw early successes in AI. Programs were developed that could solve algebra problems, prove geometrical theorems, and learn to speak English. The <strong>General Problem Solver</strong> developed by Newell and Simon could solve any well-defined problem by searching through possible solutions.</p>
            <p>Research labs were established at MIT, CMU, Stanford, and Edinburgh. Funding flowed from DARPA and other government agencies, and researchers were optimistic that a fully intelligent machine would be built within 20 years.</p>`,
          },
          {
            id: "ai-winter",
            title: "AI Winter (1974-1993)",
            content: `<p>In the 1970s, AI was subjected to critiques and financial setbacks. Researchers had failed to appreciate the difficulty of the problems they faced. Progress slowed dramatically, and funding dried up in what became known as the first "AI winter."</p>
            <p>A second wave of AI enthusiasm occurred in the 1980s with the commercial success of expert systems. However, the market for specialized AI hardware collapsed in the late 1980s, leading to a second AI winter.</p>`,
          },
          {
            id: "modern-era",
            title: "Modern Era (1993-Present)",
            content: `<p>AI began to be used successfully throughout the technology industry in the late 1990s and early 2000s. The increasing computational power, availability of large datasets, and new algorithmic approaches led to breakthroughs in <a href="/article/machine-learning">machine learning</a> and <a href="/article/neural-networks">neural networks</a>.</p>
            <p>The development of transformer architectures in 2017, and subsequent large language models like GPT, BERT, and Claude, marked a new era in AI capabilities, particularly in natural language processing and generation.</p>`,
          },
        ],
      },
      {
        id: "approaches",
        title: "Approaches",
        content: `<p>AI research has explored a number of different approaches, including simulating the brain, modeling human problem solving, formal logic, large databases of knowledge, and imitating animal behavior. In the first decades of the 21st century, highly mathematical-statistical machine learning has dominated the field.</p>`,
        subsections: [
          {
            id: "symbolic-ai",
            title: "Symbolic AI",
            content: `<p>Symbolic AI (also known as "Good Old-Fashioned AI" or GOFAI) uses human-readable representations of problems, logic, and search. It was the dominant paradigm from the 1950s through the 1980s. Expert systems, which use if-then rules to represent knowledge, are a classic example of symbolic AI.</p>`,
          },
          {
            id: "machine-learning-approach",
            title: "Machine Learning",
            content: `<p>Machine learning is the study of algorithms that improve through experience. It is the most successful approach to AI in the current era. ML algorithms build mathematical models based on training data to make predictions or decisions. Key categories include supervised learning, unsupervised learning, and reinforcement learning.</p>`,
          },
          {
            id: "deep-learning",
            title: "Deep Learning",
            content: `<p>Deep learning is a subset of machine learning based on <a href="/article/neural-networks">artificial neural networks</a> with multiple layers. Deep learning architectures such as deep neural networks, recurrent neural networks, convolutional neural networks, and transformers have been applied to fields including computer vision, natural language processing, and game playing.</p>`,
          },
        ],
      },
      {
        id: "applications",
        title: "Applications",
        content: `<p>AI has been used in a wide range of applications across virtually every industry:</p>
        <ul>
          <li><strong>Healthcare:</strong> Medical diagnosis, drug discovery, personalized treatment plans</li>
          <li><strong>Finance:</strong> Fraud detection, algorithmic trading, risk assessment</li>
          <li><strong>Transportation:</strong> Autonomous vehicles, route optimization, traffic management</li>
          <li><strong>Education:</strong> Personalized learning, automated grading, intelligent tutoring</li>
          <li><strong>Entertainment:</strong> Game AI, content recommendation, procedural generation</li>
          <li><strong>Cybersecurity:</strong> Threat detection, vulnerability analysis, automated response</li>
        </ul>`,
      },
      {
        id: "ethics",
        title: "Ethics and Concerns",
        content: `<p>The development of AI raises numerous ethical concerns, including algorithmic bias, job displacement, privacy, autonomous weapons, and the long-term existential risk of superintelligent AI. Researchers and policymakers are actively working on frameworks for responsible AI development.</p>
        <p>Key areas of ethical concern include transparency and explainability of AI decisions, fairness and avoidance of bias, accountability for AI actions, privacy and data protection, and the socioeconomic impacts of automation.</p>`,
      },
    ],
    references: [
      { id: 1, text: "McCarthy, J. (1956). \"A Proposal for the Dartmouth Summer Research Project on Artificial Intelligence\".", url: "https://example.com" },
      { id: 2, text: "Russell, S., & Norvig, P. (2020). \"Artificial Intelligence: A Modern Approach\" (4th ed.). Pearson." },
      { id: 3, text: "Goodfellow, I., Bengio, Y., & Courville, A. (2016). \"Deep Learning\". MIT Press." },
      { id: 4, text: "Turing, A. M. (1950). \"Computing Machinery and Intelligence\". Mind, 59(236), 433-460." },
    ],
    history: [
      { date: "2026-02-05", editor: "neural_agent_42", summary: "Updated modern era section with latest LLM developments", diff: "+15 -3" },
      { date: "2026-02-03", editor: "quantum_bit", summary: "Added ethics and concerns section", diff: "+42 -0" },
      { date: "2026-01-28", editor: "cipher_punk", summary: "Expanded history subsections", diff: "+67 -12" },
      { date: "2026-01-15", editor: "data_miner", summary: "Added infobox and references", diff: "+28 -5" },
      { date: "2026-01-02", editor: "root_user", summary: "Initial article creation", diff: "+180 -0" },
    ],
  },
  {
    slug: "neural-networks",
    title: "Neural Networks",
    emoji: "🧠",
    summary: "Artificial neural networks are computing systems inspired by the biological neural networks that constitute animal brains. They learn to perform tasks by considering examples, without being explicitly programmed with task-specific rules.",
    featured: true,
    categories: ["artificial-intelligence", "computer-science", "mathematics"],
    lastEdited: "2026-02-04",
    editors: 834,
    views: 567123,
    relatedArticles: ["artificial-intelligence", "machine-learning", "quantum-computing"],
    infobox: {
      "Type": "Computing Model",
      "Inspired by": "Biological Neural Networks",
      "Invented": "1943 (McCulloch & Pitts)",
      "Key architectures": "CNN, RNN, Transformer, GAN",
      "Frameworks": "TensorFlow, PyTorch, JAX",
      "Key breakthrough": "Backpropagation (1986)",
    },
    sections: [
      {
        id: "overview",
        title: "Overview",
        content: `<p>An <strong>artificial neural network</strong> (ANN), usually simply called a neural network (NN), is a computing system inspired by the biological <a href="/article/artificial-intelligence">neural networks</a> that constitute animal brains. An ANN is based on a collection of connected units or nodes called artificial neurons, which loosely model the neurons in a biological brain.</p>
        <p>Each connection, like the synapses in a biological brain, can transmit a signal to other neurons. An artificial neuron receives signals, processes them, and can signal neurons connected to it. The signal at a connection is a real number, and the output of each neuron is computed by some non-linear function of the sum of its inputs.</p>
        <p>Neural networks learn by processing examples, each of which contains a known input and result, forming probability-weighted associations between the two. Once trained, a neural network can process new inputs to generate reasonable results even for inputs it hasn't seen before.</p>`,
      },
      {
        id: "architecture",
        title: "Architecture",
        content: `<p>Neural networks are organized in layers. A typical network has an input layer, one or more hidden layers, and an output layer. The connections between neurons have associated weights that are adjusted during training.</p>`,
        subsections: [
          {
            id: "feedforward",
            title: "Feedforward Networks",
            content: `<p>In a feedforward neural network, information moves in only one direction—forward—from the input nodes, through the hidden nodes, and to the output nodes. There are no cycles or loops. The simplest type is a single-layer perceptron, which can only classify linearly separable patterns.</p>
            <p>Multi-layer perceptrons (MLPs) add hidden layers, enabling the network to learn non-linear decision boundaries. They are trained using the backpropagation algorithm.</p>`,
          },
          {
            id: "convolutional",
            title: "Convolutional Neural Networks (CNNs)",
            content: `<p>CNNs are specialized for processing structured grid data such as images. They use convolutional layers that apply learnable filters to input data, automatically detecting features like edges, textures, and complex patterns. CNNs have revolutionized computer vision tasks including image classification, object detection, and segmentation.</p>`,
          },
          {
            id: "recurrent",
            title: "Recurrent Neural Networks (RNNs)",
            content: `<p>RNNs are designed for sequential data processing. Unlike feedforward networks, RNNs have connections that form directed cycles, allowing them to maintain a form of memory. Variants like LSTM (Long Short-Term Memory) and GRU (Gated Recurrent Unit) solve the vanishing gradient problem and can learn long-term dependencies.</p>`,
          },
          {
            id: "transformers",
            title: "Transformers",
            content: `<p>The transformer architecture, introduced in the paper "Attention is All You Need" (2017), uses self-attention mechanisms to process entire sequences simultaneously rather than sequentially. This architecture has become the foundation for modern language models like GPT, BERT, and Claude, and has been adapted for vision (ViT), audio, and multimodal tasks.</p>`,
          },
        ],
      },
      {
        id: "training",
        title: "Training",
        content: `<p>Neural networks learn through a process called training, which involves adjusting the weights of connections based on the error between predicted and actual outputs. The most common training algorithm is <strong>backpropagation</strong> combined with gradient descent optimization.</p>
        <p>Training typically involves splitting data into training, validation, and test sets. Techniques like dropout, batch normalization, and data augmentation help prevent overfitting and improve generalization.</p>`,
      },
      {
        id: "applications",
        title: "Applications",
        content: `<p>Neural networks power many modern AI applications:</p>
        <ul>
          <li><strong>Image recognition:</strong> Medical imaging, facial recognition, autonomous driving</li>
          <li><strong>Natural language processing:</strong> Translation, chatbots, text generation</li>
          <li><strong>Speech recognition:</strong> Virtual assistants, transcription services</li>
          <li><strong>Game playing:</strong> AlphaGo, game AI, strategy optimization</li>
          <li><strong>Scientific research:</strong> Protein folding, drug discovery, climate modeling</li>
        </ul>`,
      },
    ],
    references: [
      { id: 1, text: "McCulloch, W.S., & Pitts, W. (1943). \"A logical calculus of the ideas immanent in nervous activity\"." },
      { id: 2, text: "Vaswani, A., et al. (2017). \"Attention is All You Need\". NeurIPS." },
      { id: 3, text: "LeCun, Y., Bengio, Y., & Hinton, G. (2015). \"Deep learning\". Nature, 521, 436-444." },
    ],
    history: [
      { date: "2026-02-04", editor: "transformer_fan", summary: "Updated transformer section with latest architectures", diff: "+22 -8" },
      { date: "2026-01-30", editor: "neural_agent_42", summary: "Added CNN and RNN subsections", diff: "+45 -0" },
      { date: "2026-01-20", editor: "deep_learner", summary: "Expanded training section", diff: "+18 -3" },
      { date: "2026-01-05", editor: "root_user", summary: "Initial article creation", diff: "+150 -0" },
    ],
  },
  {
    slug: "machine-learning",
    title: "Machine Learning",
    emoji: "📊",
    summary: "Machine learning is a subset of artificial intelligence that gives computers the ability to learn from data and improve from experience without being explicitly programmed. It focuses on developing algorithms that can access data and use it to learn for themselves.",
    categories: ["artificial-intelligence", "computer-science", "mathematics"],
    lastEdited: "2026-02-03",
    editors: 956,
    views: 723456,
    relatedArticles: ["artificial-intelligence", "neural-networks", "programming-languages"],
    infobox: {
      "Field": "Artificial Intelligence",
      "Coined by": "Arthur Samuel (1959)",
      "Types": "Supervised, Unsupervised, Reinforcement",
      "Key algorithms": "Linear Regression, SVM, Random Forest, Neural Networks",
      "Popular tools": "scikit-learn, TensorFlow, PyTorch",
    },
    sections: [
      {
        id: "overview",
        title: "Overview",
        content: `<p><strong>Machine learning</strong> (ML) is a branch of <a href="/article/artificial-intelligence">artificial intelligence</a> focused on building applications that learn from data and improve their accuracy over time without being programmed to do so. In data science, an algorithm is a sequence of statistical processing steps.</p>
        <p>Machine learning algorithms use historical data as input to predict new output values. Recommendation engines, spam filtering, malware threat detection, business process automation, and predictive maintenance are all powered by machine learning.</p>`,
      },
      {
        id: "types",
        title: "Types of Machine Learning",
        content: `<p>Machine learning is broadly categorized into three main types based on the nature of the learning signal available to a learning system.</p>`,
        subsections: [
          {
            id: "supervised",
            title: "Supervised Learning",
            content: `<p>In supervised learning, the algorithm learns from labeled training data, mapping inputs to known outputs. Common tasks include classification (categorizing data) and regression (predicting continuous values). Examples include spam detection, image classification, and price prediction.</p>`,
          },
          {
            id: "unsupervised",
            title: "Unsupervised Learning",
            content: `<p>Unsupervised learning works with unlabeled data, finding hidden patterns and structures. Key techniques include clustering (grouping similar data points), dimensionality reduction, and anomaly detection. Applications include customer segmentation, topic modeling, and feature learning.</p>`,
          },
          {
            id: "reinforcement",
            title: "Reinforcement Learning",
            content: `<p>Reinforcement learning trains agents to make sequences of decisions by rewarding desired behaviors and penalizing undesired ones. The agent learns an optimal policy through trial and error interaction with an environment. Applications include robotics, game playing (AlphaGo), and autonomous systems.</p>`,
          },
        ],
      },
      {
        id: "algorithms",
        title: "Common Algorithms",
        content: `<ul>
          <li><strong>Linear/Logistic Regression:</strong> Simple but powerful algorithms for prediction and classification</li>
          <li><strong>Decision Trees:</strong> Tree-structured models for classification and regression</li>
          <li><strong>Random Forests:</strong> Ensemble of decision trees for improved accuracy</li>
          <li><strong>Support Vector Machines:</strong> Finds optimal hyperplanes for classification</li>
          <li><strong>k-Nearest Neighbors:</strong> Instance-based learning for classification</li>
          <li><strong>Neural Networks:</strong> Deep learning models for complex pattern recognition</li>
          <li><strong>Gradient Boosting:</strong> Sequential ensemble method (XGBoost, LightGBM)</li>
        </ul>`,
      },
      {
        id: "challenges",
        title: "Challenges",
        content: `<p>Key challenges in machine learning include overfitting (model memorizes training data), underfitting (model too simple), data quality and bias, interpretability, computational costs, and the need for large labeled datasets. Active areas of research address few-shot learning, transfer learning, and federated learning.</p>`,
      },
    ],
    references: [
      { id: 1, text: "Samuel, A. (1959). \"Some Studies in Machine Learning Using the Game of Checkers\". IBM Journal." },
      { id: 2, text: "Bishop, C. M. (2006). \"Pattern Recognition and Machine Learning\". Springer." },
    ],
    history: [
      { date: "2026-02-03", editor: "data_miner", summary: "Added challenges section", diff: "+15 -0" },
      { date: "2026-01-25", editor: "ml_engineer", summary: "Expanded algorithms section", diff: "+30 -8" },
      { date: "2026-01-10", editor: "root_user", summary: "Initial article creation", diff: "+120 -0" },
    ],
  },
  {
    slug: "blockchain",
    title: "Blockchain",
    emoji: "⛓️",
    summary: "A blockchain is a distributed, immutable ledger technology that records transactions across a network of computers. It forms the technological backbone of cryptocurrencies and has applications in supply chain, voting, identity management, and decentralized finance.",
    featured: true,
    categories: ["cryptography", "internet"],
    lastEdited: "2026-02-04",
    editors: 1102,
    views: 654789,
    relatedArticles: ["cryptography", "the-internet", "cybersecurity"],
    infobox: {
      "Type": "Distributed Ledger Technology",
      "Invented by": "Satoshi Nakamoto (2008)",
      "First implementation": "Bitcoin (2009)",
      "Consensus mechanisms": "PoW, PoS, DPoS, PBFT",
      "Key platforms": "Bitcoin, Ethereum, Solana, Polkadot",
      "Smart contracts": "Self-executing code on blockchain",
    },
    sections: [
      {
        id: "overview",
        title: "Overview",
        content: `<p>A <strong>blockchain</strong> is a type of distributed ledger technology (DLT) that consists of a growing list of records, called blocks, that are securely linked together using <a href="/article/cryptography">cryptographic</a> hashes. Each block contains a cryptographic hash of the previous block, a timestamp, and transaction data.</p>
        <p>By design, a blockchain is resistant to modification of its data. Once recorded, the data in any given block cannot be altered retroactively without the alteration of all subsequent blocks, which requires consensus of the network majority.</p>`,
      },
      {
        id: "how-it-works",
        title: "How It Works",
        content: `<p>When a new transaction occurs, it is broadcast to a peer-to-peer network of computers (nodes). These nodes validate the transaction using known algorithms. Once verified, the transaction is combined with other transactions to create a new block of data for the ledger.</p>
        <p>The new block is added to the existing blockchain in a way that is permanent and unalterable. Each participant maintains a copy of the entire blockchain, and consensus mechanisms ensure all copies stay synchronized.</p>`,
        subsections: [
          {
            id: "consensus",
            title: "Consensus Mechanisms",
            content: `<p><strong>Proof of Work (PoW):</strong> Miners compete to solve complex mathematical puzzles. The first to solve it gets to add the block and earn rewards. Used by Bitcoin.</p>
            <p><strong>Proof of Stake (PoS):</strong> Validators are chosen based on the amount of cryptocurrency they "stake" as collateral. More energy-efficient than PoW. Used by Ethereum 2.0.</p>
            <p><strong>Delegated Proof of Stake (DPoS):</strong> Token holders vote for delegates who validate transactions. Used by EOS and Tron.</p>`,
          },
          {
            id: "smart-contracts",
            title: "Smart Contracts",
            content: `<p>Smart contracts are self-executing programs stored on a blockchain that automatically execute when predetermined conditions are met. They were first proposed by Nick Szabo in 1994 and implemented on the Ethereum blockchain. Smart contracts enable decentralized applications (dApps) and decentralized finance (DeFi).</p>`,
          },
        ],
      },
      {
        id: "applications",
        title: "Applications",
        content: `<ul>
          <li><strong>Cryptocurrency:</strong> Digital currencies like Bitcoin, Ethereum, and stablecoins</li>
          <li><strong>DeFi:</strong> Decentralized lending, borrowing, and trading platforms</li>
          <li><strong>NFTs:</strong> Non-fungible tokens for digital ownership</li>
          <li><strong>Supply Chain:</strong> Transparent tracking of goods from origin to consumer</li>
          <li><strong>Identity:</strong> Self-sovereign identity and credential verification</li>
          <li><strong>Voting:</strong> Transparent, tamper-resistant election systems</li>
          <li><strong>Healthcare:</strong> Secure sharing of medical records</li>
        </ul>`,
      },
      {
        id: "limitations",
        title: "Limitations",
        content: `<p>Despite its potential, blockchain technology faces several challenges: scalability (limited transactions per second), energy consumption (especially PoW), regulatory uncertainty, interoperability between chains, and the complexity of development. Layer-2 solutions and new consensus mechanisms are actively being developed to address these issues.</p>`,
      },
    ],
    references: [
      { id: 1, text: "Nakamoto, S. (2008). \"Bitcoin: A Peer-to-Peer Electronic Cash System\"." },
      { id: 2, text: "Buterin, V. (2014). \"A Next-Generation Smart Contract and Decentralized Application Platform\"." },
      { id: 3, text: "Szabo, N. (1997). \"Formalizing and Securing Relationships on Public Networks\"." },
    ],
    history: [
      { date: "2026-02-04", editor: "satoshi_fan", summary: "Updated DeFi applications", diff: "+18 -5" },
      { date: "2026-01-28", editor: "cipher_punk", summary: "Added smart contracts subsection", diff: "+25 -0" },
      { date: "2026-01-15", editor: "root_user", summary: "Initial article creation", diff: "+140 -0" },
    ],
  },
  {
    slug: "quantum-computing",
    title: "Quantum Computing",
    emoji: "⚛️",
    summary: "Quantum computing harnesses quantum mechanical phenomena such as superposition and entanglement to process information in fundamentally new ways, potentially solving problems intractable for classical computers.",
    categories: ["hardware", "computer-science", "mathematics"],
    lastEdited: "2026-02-02",
    editors: 623,
    views: 445678,
    relatedArticles: ["cryptography", "neural-networks", "programming-languages"],
    infobox: {
      "Type": "Computing Paradigm",
      "Based on": "Quantum Mechanics",
      "Unit of computation": "Qubit",
      "Key companies": "IBM, Google, IonQ, Rigetti",
      "Key algorithms": "Shor's, Grover's, VQE",
      "Current state": "NISQ era (Noisy Intermediate-Scale Quantum)",
    },
    sections: [
      {
        id: "overview",
        title: "Overview",
        content: `<p><strong>Quantum computing</strong> is a type of computation that uses quantum bits (qubits) instead of classical bits. While a classical bit can be either 0 or 1, a qubit can exist in a superposition of both states simultaneously, enabling quantum computers to process vast amounts of information in parallel.</p>
        <p>Quantum computers exploit fundamental principles of quantum mechanics—superposition, entanglement, and interference—to perform calculations that would be practically impossible for classical computers. This opens up possibilities for breakthroughs in <a href="/article/cryptography">cryptography</a>, drug discovery, optimization, and materials science.</p>`,
      },
      {
        id: "principles",
        title: "Quantum Principles",
        content: `<p>Three key quantum mechanical principles enable quantum computing:</p>`,
        subsections: [
          {
            id: "superposition",
            title: "Superposition",
            content: `<p>Superposition allows a qubit to exist in multiple states simultaneously. While a classical bit is either 0 or 1, a qubit can be in a state that is a combination of both. When measured, the qubit "collapses" to one definite state. With n qubits, a quantum computer can represent 2^n states simultaneously.</p>`,
          },
          {
            id: "entanglement",
            title: "Entanglement",
            content: `<p>Quantum entanglement is a phenomenon where two or more qubits become correlated such that the quantum state of each qubit cannot be described independently. Measuring one entangled qubit instantly determines the state of its partner, regardless of distance. This property is crucial for quantum algorithms and quantum communication.</p>`,
          },
          {
            id: "interference",
            title: "Quantum Interference",
            content: `<p>Quantum interference allows quantum algorithms to amplify correct answers and cancel wrong ones. By carefully designing quantum circuits, algorithms can manipulate the probability amplitudes of qubits so that the probability of measuring the correct answer is maximized.</p>`,
          },
        ],
      },
      {
        id: "algorithms",
        title: "Quantum Algorithms",
        content: `<ul>
          <li><strong>Shor's Algorithm:</strong> Factors large integers in polynomial time, threatening RSA encryption</li>
          <li><strong>Grover's Algorithm:</strong> Provides quadratic speedup for unstructured search problems</li>
          <li><strong>VQE:</strong> Variational Quantum Eigensolver for chemistry simulations</li>
          <li><strong>QAOA:</strong> Quantum Approximate Optimization Algorithm for combinatorial problems</li>
          <li><strong>Quantum Machine Learning:</strong> Hybrid classical-quantum approaches to ML problems</li>
        </ul>`,
      },
      {
        id: "challenges",
        title: "Challenges",
        content: `<p>Current quantum computers face significant challenges: decoherence (qubits losing their quantum state), error rates, limited qubit counts, the need for extreme cooling (near absolute zero for superconducting qubits), and the difficulty of quantum error correction. The current era is known as NISQ (Noisy Intermediate-Scale Quantum), where devices have 50-1000+ qubits but significant noise.</p>`,
      },
    ],
    references: [
      { id: 1, text: "Feynman, R. P. (1982). \"Simulating Physics with Computers\". International Journal of Theoretical Physics." },
      { id: 2, text: "Shor, P. W. (1994). \"Algorithms for quantum computation\". FOCS '94." },
      { id: 3, text: "Nielsen, M. A., & Chuang, I. L. (2010). \"Quantum Computation and Quantum Information\". Cambridge University Press." },
    ],
    history: [
      { date: "2026-02-02", editor: "quantum_bit", summary: "Updated NISQ era information", diff: "+12 -4" },
      { date: "2026-01-20", editor: "entangled_dev", summary: "Added quantum algorithms section", diff: "+35 -0" },
      { date: "2026-01-08", editor: "root_user", summary: "Initial article creation", diff: "+125 -0" },
    ],
  },
  {
    slug: "cryptography",
    title: "Cryptography",
    emoji: "🔐",
    summary: "Cryptography is the practice and study of techniques for securing communication and data in the presence of adversaries. It encompasses encryption, digital signatures, hash functions, and protocols that ensure confidentiality, integrity, and authentication.",
    categories: ["cryptography", "mathematics", "computer-science"],
    lastEdited: "2026-02-01",
    editors: 789,
    views: 534567,
    relatedArticles: ["blockchain", "cybersecurity", "quantum-computing"],
    infobox: {
      "Field": "Information Security",
      "Ancient origins": "Caesar Cipher (~100 BC)",
      "Modern era": "Shannon's Information Theory (1949)",
      "Types": "Symmetric, Asymmetric, Hash Functions",
      "Standards": "AES, RSA, SHA-256, TLS",
      "Threat": "Quantum Computing",
    },
    sections: [
      {
        id: "overview",
        title: "Overview",
        content: `<p><strong>Cryptography</strong> is the science of encoding and decoding information to protect it from unauthorized access. It is fundamental to modern digital security, enabling secure communication, authentication, and data integrity across the internet and digital systems.</p>
        <p>Modern cryptography is based on mathematical theory and computer science practice. Cryptographic algorithms are designed around computational hardness assumptions, making them hard to break in practice by any adversary.</p>`,
      },
      {
        id: "types",
        title: "Types of Cryptography",
        content: ``,
        subsections: [
          {
            id: "symmetric",
            title: "Symmetric Cryptography",
            content: `<p>Symmetric-key cryptography uses the same key for both encryption and decryption. It is fast and efficient for large amounts of data. The most widely used symmetric algorithm is AES (Advanced Encryption Standard), which operates on fixed-size blocks of data using keys of 128, 192, or 256 bits.</p>`,
          },
          {
            id: "asymmetric",
            title: "Asymmetric Cryptography",
            content: `<p>Asymmetric (public-key) cryptography uses a pair of keys: a public key for encryption and a private key for decryption. RSA, Elliptic Curve Cryptography (ECC), and Diffie-Hellman are key asymmetric algorithms. Public-key cryptography enables digital signatures, key exchange, and is the foundation of TLS/SSL used across <a href="/article/the-internet">the internet</a>.</p>`,
          },
          {
            id: "hashing",
            title: "Hash Functions",
            content: `<p>Cryptographic hash functions produce a fixed-size output (digest) from arbitrary input, designed to be one-way and collision-resistant. SHA-256, used in <a href="/article/blockchain">Bitcoin</a>, and SHA-3 are widely used hash functions. Hash functions are essential for digital signatures, password storage, and data integrity verification.</p>`,
          },
        ],
      },
      {
        id: "applications",
        title: "Applications",
        content: `<ul>
          <li><strong>TLS/SSL:</strong> Securing web communications (HTTPS)</li>
          <li><strong>Digital Signatures:</strong> Verifying authenticity of documents and software</li>
          <li><strong>Blockchain:</strong> Securing transactions and maintaining ledger integrity</li>
          <li><strong>Password Storage:</strong> Hashing passwords for secure storage</li>
          <li><strong>Secure Messaging:</strong> End-to-end encryption in messaging apps</li>
          <li><strong>VPNs:</strong> Encrypting network traffic for privacy</li>
        </ul>`,
      },
      {
        id: "post-quantum",
        title: "Post-Quantum Cryptography",
        content: `<p>With the advancement of <a href="/article/quantum-computing">quantum computing</a>, many current cryptographic algorithms (particularly RSA and ECC) could become vulnerable. Post-quantum cryptography (PQC) aims to develop algorithms resistant to quantum attacks. NIST has been standardizing PQC algorithms, including lattice-based, hash-based, and code-based cryptographic schemes.</p>`,
      },
    ],
    references: [
      { id: 1, text: "Diffie, W., & Hellman, M. (1976). \"New Directions in Cryptography\". IEEE Transactions on Information Theory." },
      { id: 2, text: "Rivest, R. L., Shamir, A., & Adleman, L. (1978). \"A Method for Obtaining Digital Signatures and Public-Key Cryptosystems\"." },
      { id: 3, text: "Shannon, C. E. (1949). \"Communication Theory of Secrecy Systems\". Bell System Technical Journal." },
    ],
    history: [
      { date: "2026-02-01", editor: "cipher_punk", summary: "Added post-quantum cryptography section", diff: "+20 -0" },
      { date: "2026-01-22", editor: "crypto_dev", summary: "Expanded hash functions subsection", diff: "+15 -3" },
      { date: "2026-01-10", editor: "root_user", summary: "Initial article creation", diff: "+130 -0" },
    ],
  },
  {
    slug: "the-internet",
    title: "The Internet",
    emoji: "🌐",
    summary: "The Internet is a global system of interconnected computer networks that uses the Internet Protocol Suite (TCP/IP) to communicate. It is a network of networks that carries a vast range of information resources and services.",
    categories: ["internet", "history"],
    lastEdited: "2026-01-30",
    editors: 1456,
    views: 987654,
    relatedArticles: ["cybersecurity", "cryptography", "open-source-software"],
    infobox: {
      "Type": "Global Computer Network",
      "Predecessor": "ARPANET (1969)",
      "Protocol": "TCP/IP",
      "Users": "~5.5 billion (2026)",
      "Governance": "ICANN, IETF, W3C",
      "Key services": "WWW, Email, DNS, Streaming",
    },
    sections: [
      {
        id: "overview",
        title: "Overview",
        content: `<p>The <strong>Internet</strong> is the global system of interconnected computer networks that uses the Internet protocol suite (TCP/IP) to communicate between networks and devices. It is a network of networks that consists of private, public, academic, business, and government networks linked by a broad array of electronic, wireless, and optical networking technologies.</p>
        <p>The Internet carries a vast range of information resources and services, such as the interlinked hypertext documents and applications of the World Wide Web (WWW), electronic mail, telephony, and file sharing.</p>`,
      },
      {
        id: "history",
        title: "History",
        content: `<p>The Internet originated from ARPANET, a project funded by the U.S. Department of Defense's Advanced Research Projects Agency (DARPA) in the late 1960s. The first message was sent over ARPANET on October 29, 1969, from UCLA to Stanford Research Institute.</p>
        <p>Key milestones include the development of TCP/IP (1970s-80s), the creation of the Domain Name System (1983), the invention of the World Wide Web by Tim Berners-Lee (1989), and the commercialization of the Internet in the 1990s.</p>`,
      },
      {
        id: "protocols",
        title: "Protocols and Standards",
        content: `<ul>
          <li><strong>TCP/IP:</strong> The fundamental protocol suite enabling internet communication</li>
          <li><strong>HTTP/HTTPS:</strong> Protocols for web browsing, secured with <a href="/article/cryptography">TLS encryption</a></li>
          <li><strong>DNS:</strong> Domain Name System translating human-readable names to IP addresses</li>
          <li><strong>SMTP/IMAP:</strong> Email protocols for sending and receiving mail</li>
          <li><strong>WebSocket:</strong> Full-duplex communication protocol for real-time applications</li>
          <li><strong>IPv6:</strong> Next-generation Internet Protocol addressing the exhaustion of IPv4 addresses</li>
        </ul>`,
      },
      {
        id: "impact",
        title: "Societal Impact",
        content: `<p>The Internet has fundamentally transformed nearly every aspect of modern life—communication, commerce, entertainment, education, governance, and social interaction. It has enabled the rise of the digital economy, social media, remote work, and global connectivity. However, it has also raised concerns about privacy, misinformation, digital divide, and <a href="/article/cybersecurity">cybersecurity</a> threats.</p>`,
      },
    ],
    references: [
      { id: 1, text: "Leiner, B. M., et al. (2009). \"A Brief History of the Internet\". ACM SIGCOMM." },
      { id: 2, text: "Berners-Lee, T. (1989). \"Information Management: A Proposal\". CERN." },
    ],
    history: [
      { date: "2026-01-30", editor: "web_pioneer", summary: "Updated user statistics for 2026", diff: "+5 -5" },
      { date: "2026-01-18", editor: "net_admin", summary: "Added protocols section", diff: "+28 -0" },
      { date: "2026-01-05", editor: "root_user", summary: "Initial article creation", diff: "+100 -0" },
    ],
  },
  {
    slug: "programming-languages",
    title: "Programming Languages",
    emoji: "⌨️",
    summary: "A programming language is a formal language comprising a set of instructions used to produce various kinds of output, from simple calculations to complex software systems. They serve as the primary tool for software development.",
    categories: ["computer-science", "history"],
    lastEdited: "2026-02-05",
    editors: 1678,
    views: 1123456,
    relatedArticles: ["artificial-intelligence", "open-source-software", "the-internet"],
    infobox: {
      "First language": "Plankalkül (1948), Fortran (1957)",
      "Paradigms": "Imperative, OOP, Functional, Logic",
      "Most popular (2026)": "Python, JavaScript, TypeScript, Rust",
      "Compiled examples": "C, C++, Rust, Go",
      "Interpreted examples": "Python, JavaScript, Ruby",
      "Total languages": "~9,000+ documented",
    },
    sections: [
      {
        id: "overview",
        title: "Overview",
        content: `<p>A <strong>programming language</strong> is a system of notation for writing computer programs. Programming languages are described in terms of their syntax (form) and semantics (meaning). They range from low-level languages close to machine code (assembly) to high-level languages with strong abstraction from hardware details (Python, JavaScript).</p>
        <p>The choice of programming language depends on factors such as the domain (web, systems, data science), performance requirements, developer productivity, ecosystem, and team expertise.</p>`,
      },
      {
        id: "paradigms",
        title: "Programming Paradigms",
        content: ``,
        subsections: [
          {
            id: "imperative",
            title: "Imperative Programming",
            content: `<p>Imperative programming describes computation in terms of statements that change program state. Procedural programming (C, Pascal) and object-oriented programming (Java, C++, Python) are subtypes. The programmer specifies <em>how</em> to achieve a result step by step.</p>`,
          },
          {
            id: "functional",
            title: "Functional Programming",
            content: `<p>Functional programming treats computation as the evaluation of mathematical functions, avoiding mutable state and side effects. Languages like Haskell, Erlang, and Clojure are purely functional, while many modern languages (JavaScript, Python, Rust) incorporate functional features.</p>`,
          },
          {
            id: "logic",
            title: "Logic Programming",
            content: `<p>Logic programming is based on formal logic. Programs are sets of logical statements, and computation is performed by making logical inferences. Prolog is the most well-known logic programming language, used in <a href="/article/artificial-intelligence">AI research</a> and computational linguistics.</p>`,
          },
        ],
      },
      {
        id: "notable-languages",
        title: "Notable Languages",
        content: `<ul>
          <li><strong>Python:</strong> Versatile, readable language dominant in AI/ML, data science, and scripting</li>
          <li><strong>JavaScript:</strong> The language of the web, running in browsers and servers (Node.js)</li>
          <li><strong>TypeScript:</strong> JavaScript with static typing, widely used for large applications</li>
          <li><strong>Rust:</strong> Systems language focused on memory safety without garbage collection</li>
          <li><strong>Go:</strong> Google's language for scalable cloud services and systems programming</li>
          <li><strong>C/C++:</strong> Foundational systems languages for OS, games, and performance-critical code</li>
          <li><strong>Java:</strong> Enterprise workhorse, write-once-run-anywhere via JVM</li>
          <li><strong>Swift/Kotlin:</strong> Modern languages for iOS and Android development</li>
        </ul>`,
      },
      {
        id: "evolution",
        title: "Evolution and Trends",
        content: `<p>Programming language design continues to evolve. Modern trends include stronger type systems, memory safety guarantees (Rust), seamless concurrency (Go, Erlang), WebAssembly for near-native web performance, and AI-assisted coding tools that work across languages. The boundaries between compiled and interpreted languages continue to blur with JIT compilation and transpilation.</p>`,
      },
    ],
    references: [
      { id: 1, text: "Aho, A. V., Lam, M. S., Sethi, R., & Ullman, J. D. (2006). \"Compilers: Principles, Techniques, and Tools\". Pearson." },
      { id: 2, text: "Pierce, B. C. (2002). \"Types and Programming Languages\". MIT Press." },
    ],
    history: [
      { date: "2026-02-05", editor: "polyglot_dev", summary: "Updated 2026 language popularity rankings", diff: "+8 -8" },
      { date: "2026-01-28", editor: "rust_evangelist", summary: "Added Rust and modern trends", diff: "+20 -5" },
      { date: "2026-01-12", editor: "root_user", summary: "Initial article creation", diff: "+115 -0" },
    ],
  },
  {
    slug: "cybersecurity",
    title: "Cybersecurity",
    emoji: "🛡️",
    summary: "Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks. It encompasses technologies, processes, and practices designed to protect data integrity, confidentiality, and availability.",
    categories: ["cryptography", "internet", "computer-science"],
    lastEdited: "2026-02-03",
    editors: 945,
    views: 678901,
    relatedArticles: ["cryptography", "the-internet", "blockchain"],
    infobox: {
      "Field": "Information Security",
      "Key frameworks": "NIST CSF, ISO 27001, MITRE ATT&CK",
      "Common threats": "Malware, Phishing, Ransomware, APTs",
      "CIA Triad": "Confidentiality, Integrity, Availability",
      "Career roles": "Analyst, Pentester, Architect, CISO",
      "Market size (2026)": "~$250 billion",
    },
    sections: [
      {
        id: "overview",
        title: "Overview",
        content: `<p><strong>Cybersecurity</strong> is the practice of defending computers, servers, mobile devices, electronic systems, networks, and data from malicious attacks. It is also known as information technology security or electronic information security. The field is increasingly important as society becomes more dependent on digital infrastructure.</p>
        <p>The cybersecurity landscape is constantly evolving, with new threats emerging alongside new defense technologies. Organizations must adopt a multi-layered approach to security, combining technical controls, policies, and human awareness.</p>`,
      },
      {
        id: "threat-landscape",
        title: "Threat Landscape",
        content: `<ul>
          <li><strong>Malware:</strong> Viruses, worms, trojans, ransomware, and spyware</li>
          <li><strong>Phishing:</strong> Social engineering attacks via email, SMS, or fake websites</li>
          <li><strong>APTs:</strong> Advanced Persistent Threats from state-sponsored or organized groups</li>
          <li><strong>Zero-day exploits:</strong> Attacks targeting previously unknown vulnerabilities</li>
          <li><strong>DDoS:</strong> Distributed Denial of Service attacks overwhelming systems</li>
          <li><strong>Supply chain attacks:</strong> Compromising trusted software supply chains</li>
          <li><strong>Insider threats:</strong> Malicious or negligent actions by authorized users</li>
        </ul>`,
      },
      {
        id: "defense",
        title: "Defense Strategies",
        content: `<p>Effective cybersecurity requires a defense-in-depth approach with multiple layers of protection:</p>
        <p><strong>Prevention:</strong> Firewalls, antivirus, access controls, <a href="/article/cryptography">encryption</a>, patch management. <strong>Detection:</strong> Intrusion detection systems, SIEM, behavioral analytics, threat intelligence. <strong>Response:</strong> Incident response plans, forensics, backup and recovery procedures. <strong>Recovery:</strong> Business continuity planning, disaster recovery, lessons learned.</p>`,
      },
      {
        id: "emerging-trends",
        title: "Emerging Trends",
        content: `<p>Key trends shaping cybersecurity include: Zero Trust Architecture (never trust, always verify), <a href="/article/artificial-intelligence">AI-powered</a> threat detection and response, cloud security and SASE, DevSecOps integration, privacy-enhancing technologies, and the growing challenge of securing IoT devices. The rise of quantum computing also poses both threats and opportunities for security.</p>`,
      },
    ],
    references: [
      { id: 1, text: "NIST (2018). \"Framework for Improving Critical Infrastructure Cybersecurity\". Version 1.1." },
      { id: 2, text: "Anderson, R. (2020). \"Security Engineering: A Guide to Building Dependable Distributed Systems\". Wiley." },
    ],
    history: [
      { date: "2026-02-03", editor: "sec_analyst", summary: "Added 2026 market size and trends", diff: "+15 -8" },
      { date: "2026-01-25", editor: "cipher_punk", summary: "Expanded threat landscape", diff: "+25 -5" },
      { date: "2026-01-10", editor: "root_user", summary: "Initial article creation", diff: "+110 -0" },
    ],
  },
  {
    slug: "open-source-software",
    title: "Open Source Software",
    emoji: "📖",
    summary: "Open source software (OSS) is software with source code that anyone can inspect, modify, and enhance. The open source movement has shaped modern software development, powering everything from operating systems to AI frameworks.",
    categories: ["open-source", "computer-science", "history"],
    lastEdited: "2026-02-01",
    editors: 567,
    views: 345678,
    relatedArticles: ["programming-languages", "the-internet", "linux"],
    infobox: {
      "Concept origin": "Free Software Foundation (1985)",
      "Term coined": "1998 (OSI)",
      "Key licenses": "MIT, GPL, Apache 2.0, BSD",
      "Key projects": "Linux, Firefox, VS Code, TensorFlow",
      "Platforms": "GitHub, GitLab, SourceForge",
      "Contributors worldwide": "100+ million (GitHub)",
    },
    sections: [
      {
        id: "overview",
        title: "Overview",
        content: `<p><strong>Open source software</strong> (OSS) is software released under a license that grants users the rights to use, study, change, and distribute the software and its source code to anyone and for any purpose. Open source development promotes collaboration, transparency, and community-driven innovation.</p>
        <p>The open source model has become the dominant force in software development. Most modern software infrastructure, from operating systems to web servers to <a href="/article/artificial-intelligence">AI frameworks</a>, is built on open source foundations.</p>`,
      },
      {
        id: "history",
        title: "History",
        content: `<p>The free software movement began in 1983 when Richard Stallman launched the GNU Project, aiming to create a free Unix-like operating system. The Free Software Foundation (FSF) was established in 1985 to support this mission.</p>
        <p>The term "open source" was coined in 1998, when a group including Eric Raymond and Bruce Perens advocated for a more business-friendly approach to free software. The Open Source Initiative (OSI) was founded to promote and protect open source software.</p>
        <p>The release of Linux (1991), the rise of Apache web server, and the creation of GitHub (2008) were pivotal moments that accelerated open source adoption worldwide.</p>`,
      },
      {
        id: "licenses",
        title: "Licenses",
        content: `<ul>
          <li><strong>MIT License:</strong> Very permissive, allows almost unrestricted use</li>
          <li><strong>GPL (GNU General Public License):</strong> Copyleft license requiring derived works to also be GPL</li>
          <li><strong>Apache 2.0:</strong> Permissive with patent protection provisions</li>
          <li><strong>BSD Licenses:</strong> Permissive, similar to MIT</li>
          <li><strong>Creative Commons:</strong> Primarily for non-software creative works</li>
          <li><strong>AGPL:</strong> Like GPL but also covers network use (SaaS)</li>
        </ul>`,
      },
      {
        id: "impact",
        title: "Impact on Software Development",
        content: `<p>Open source has fundamentally changed how software is built and distributed. It has enabled rapid innovation through shared code, reduced development costs, improved security through transparency, and created vibrant developer communities. Major technology companies including Google, Microsoft, Meta, and Amazon are significant contributors to open source projects.</p>
        <p>The package ecosystem (npm, PyPI, crates.io) has made it trivially easy to build on top of open source libraries, accelerating development cycles from months to days.</p>`,
      },
    ],
    references: [
      { id: 1, text: "Raymond, E. S. (1999). \"The Cathedral and the Bazaar\". O'Reilly Media." },
      { id: 2, text: "Stallman, R. (2002). \"Free Software, Free Society\". GNU Press." },
    ],
    history: [
      { date: "2026-02-01", editor: "foss_fan", summary: "Updated contributor statistics", diff: "+8 -4" },
      { date: "2026-01-20", editor: "license_nerd", summary: "Expanded licenses section with AGPL", diff: "+12 -0" },
      { date: "2026-01-08", editor: "root_user", summary: "Initial article creation", diff: "+95 -0" },
    ],
  },
  {
    slug: "linux",
    title: "Linux",
    emoji: "🐧",
    summary: "Linux is a family of open-source Unix-like operating systems based on the Linux kernel, first released by Linus Torvalds in 1991. It powers everything from smartphones (Android) to supercomputers, web servers, and cloud infrastructure.",
    categories: ["open-source", "computer-science", "hardware"],
    lastEdited: "2026-01-29",
    editors: 1234,
    views: 876543,
    relatedArticles: ["open-source-software", "programming-languages", "the-internet"],
    infobox: {
      "Type": "Operating System Kernel",
      "Creator": "Linus Torvalds",
      "Initial release": "September 17, 1991",
      "Written in": "C, Assembly",
      "License": "GPL v2",
      "Popular distros": "Ubuntu, Fedora, Arch, Debian",
      "Market share": "100% of top 500 supercomputers",
    },
    sections: [
      {
        id: "overview",
        title: "Overview",
        content: `<p><strong>Linux</strong> is an <a href="/article/open-source-software">open-source</a>, Unix-like operating system kernel first released on September 17, 1991 by Finnish computer science student Linus Torvalds. Combined with the GNU system's userspace tools, it forms a complete operating system known as GNU/Linux, though commonly referred to simply as "Linux."</p>
        <p>Linux has become one of the most important pieces of software in history. It runs on more platforms than any other operating system—from embedded devices and smartphones to mainframes and supercomputers. All 500 of the world's top supercomputers run Linux.</p>`,
      },
      {
        id: "architecture",
        title: "Architecture",
        content: `<p>The Linux kernel is a monolithic kernel that handles process management, memory management, device drivers, file system support, and networking. It uses a modular design that allows functionality to be loaded and unloaded at runtime via kernel modules.</p>
        <p>A typical Linux distribution packages the kernel with system libraries (glibc), system utilities (coreutils), a package manager, a desktop environment (optional), and application software to create a complete operating system.</p>`,
      },
      {
        id: "distributions",
        title: "Distributions",
        content: `<ul>
          <li><strong>Ubuntu:</strong> Most popular desktop distribution, based on Debian, user-friendly</li>
          <li><strong>Fedora:</strong> Cutting-edge features, backed by Red Hat, strong community</li>
          <li><strong>Debian:</strong> One of the oldest, known for stability and the .deb package format</li>
          <li><strong>Arch Linux:</strong> Rolling release, minimalist, highly customizable</li>
          <li><strong>Red Hat Enterprise Linux:</strong> Commercial distribution for enterprise servers</li>
          <li><strong>Alpine Linux:</strong> Lightweight, security-focused, popular for containers</li>
          <li><strong>NixOS:</strong> Declarative configuration, reproducible builds</li>
        </ul>`,
      },
      {
        id: "impact",
        title: "Impact",
        content: `<p>Linux's impact on computing cannot be overstated. It powers the majority of <a href="/article/the-internet">internet</a> servers, the entire Android mobile ecosystem, most IoT devices, and virtually all cloud computing infrastructure. Its open-source nature has fostered a massive developer community and ecosystem. The collaborative development model pioneered by the Linux kernel project has influenced how software is built worldwide.</p>`,
      },
    ],
    references: [
      { id: 1, text: "Torvalds, L. (1991). \"Free minix-like kernel sources for 386-AT\". comp.os.minix newsgroup." },
      { id: 2, text: "Torvalds, L., & Diamond, D. (2001). \"Just for Fun: The Story of an Accidental Revolutionary\". HarperBusiness." },
    ],
    history: [
      { date: "2026-01-29", editor: "kernel_dev", summary: "Updated distribution rankings for 2026", diff: "+10 -8" },
      { date: "2026-01-15", editor: "tux_lover", summary: "Added NixOS to distributions", diff: "+5 -0" },
      { date: "2026-01-05", editor: "root_user", summary: "Initial article creation", diff: "+90 -0" },
    ],
  },
];

// Helper functions
export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getArticlesByCategory(categorySlug: string): Article[] {
  return articles.filter((a) => a.categories.includes(categorySlug));
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getFeaturedArticles(): Article[] {
  return articles.filter((a) => a.featured);
}

export function searchArticles(query: string): Article[] {
  const lower = query.toLowerCase();
  return articles.filter(
    (a) =>
      a.title.toLowerCase().includes(lower) ||
      a.summary.toLowerCase().includes(lower) ||
      a.categories.some((c) => c.includes(lower)) ||
      a.sections.some(
        (s) =>
          s.title.toLowerCase().includes(lower) ||
          s.content.toLowerCase().includes(lower) ||
          s.subsections?.some(
            (sub) =>
              sub.title.toLowerCase().includes(lower) ||
              sub.content.toLowerCase().includes(lower)
          )
      )
  );
}

export function getRandomArticle(): Article {
  return articles[Math.floor(Math.random() * articles.length)];
}

export function getTotalStats() {
  return {
    articles: articles.length,
    categories: categories.length,
    totalEditors: new Set(articles.flatMap((a) => a.history.map((h) => h.editor))).size,
    totalEdits: articles.reduce((sum, a) => sum + a.history.length, 0),
  };
}
