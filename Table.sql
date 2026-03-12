CREATE TABLE Cursos(
    idCurso SERIAL PRIMARY KEY,
    nomeCurso VARCHAR(255) NOT NULL,
    imagemCurso TEXT NOT NULL,
    descricao TEXT NOT NULL
);

CREATE TABLE Imagens(
    idImagem SERIAL PRIMARY KEY,
    nome VARCHAR(30) NOT NULL,
    url_imagem TEXT NOT NULL
);

CREATE TABLE Produtos(
    idProduto SERIAL PRIMARY KEY,
    preco DECIMAL(10,2) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    taxa DECIMAL(10,2) NOT NULL,
    estoque INT NOT NULL,
    categoria VARCHAR(20) NOT NULL,
    idCurso INT,
    FOREIGN KEY (idCurso) REFERENCES Cursos(idCurso),
    idImagem INT,
    FOREIGN KEY (idImagem) REFERENCES Imagens(idImagem)
);

CREATE TABLE Carrinho(
    idCarrinho SERIAL PRIMARY KEY,
    valorTotal FLOAT NOT NULL
);

CREATE TABLE Venda(
    idVenda SERIAL PRIMARY KEY,
    vendido BIT NOT NULL,
    data_hora TIMESTAMP NOT NULL,
    idCarrinho INT,
    FOREIGN KEY (idCarrinho) REFERENCES Carrinho(idCarrinho),
    idProduto INT,
    FOREIGN KEY (idProduto) REFERENCES Produtos(idProduto)
)
