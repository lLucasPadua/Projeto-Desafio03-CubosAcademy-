create table usuarios (
	id serial primary key,
  	nome text not null,
  	nome_loja text not null,
  	email text not null unique,
  	senha text not null
);



create table produtos (
	id serial primary key,
  	usuario_id int not null references usuarios (id),
  	nome text not null,
  	quantidade int not null,
  	categoria text not null,
  	preco int not null,
  	descricao text,
  	imagem text
); 
