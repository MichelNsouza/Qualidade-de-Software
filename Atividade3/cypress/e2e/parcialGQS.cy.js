let tarefa = "Tarefa 0";
let tarefa1 = "Tarefa 1";
let tarefa2 = "Tarefa 2";
let tarefa3 = "Tarefa 3";

function cadastra3Tarefas(){
        cy.get('#todo_title').click().type(tarefa1);
        cy.get('.bg-white > .col-auto > .btn').click();
        cy.get('#todo_title').click().type(tarefa2);
        cy.get('.bg-white > .col-auto > .btn').click();
        cy.get('#todo_title').click().type(tarefa3);
        cy.get('.bg-white > .col-auto > .btn').click();
}

function visita(){
    cy.visit("https://phpauloreis.github.io/todo-list-alpine-js/");
}


describe("Usuário cria uma tarefa", () => {
    it("como usuário, eu gostaria de poder adicionar uma tarefa", () => {
        visita();
        cy.get('#todo_title').click().type(tarefa);
        cy.get('.bg-white > .col-auto > .btn').click();
        cy.contains('[x-text="todo.task"]', tarefa);
    });
    it("Adicionar uma nova tarefa pressionando Enter", () => {
        visita();
        cy.get('#todo_title').click().type(tarefa);
        cy.get('.bg-white > .col-auto > .btn').type('{enter}');
        cy.contains('[x-text="todo.task"]', tarefa);
    });
    it("Adicionar uma nova tarefa em branco", () => {
        visita();
        cy.get('.bg-white > .col-auto > .btn').click();
        /*cy.on('window:alert', (str) => {
            expect(str).to.equal(`Digite um título para a tarefa!`)
          })*/
        cy.get('.mb-3').should('contain', 'Tarefas cadastradas: 0');
    });
    it("Adicionar uma nova tarefa em branco com enter", () => {
        visita();
        cy.get('.bg-white > .col-auto > .btn').type('{enter}');
        cy.get('.mb-3').should('contain', 'Tarefas cadastradas: 0');
    });
   /* it.only("nova tarefa adicionada possui data correta", () => {
        visita();
        cy.get('#todo_title').click().type(tarefa);
        cy.get('.bg-white > .col-auto > .btn').click();
        cy.get('[x-text="getFormatedDate(todo.createdAt)"]').then(($dataElement) => {
            const dataNaPagina = new Date($dataElement.text().trim());
            const dataAtual = new Date();
            const dataNaPaginaString = dataNaPagina.toLocaleDateString('pt-BR');
            const dataAtualString = dataAtual.toLocaleDateString('pt-BR');
            cy.wrap(dataNaPaginaString).should('contain', dataAtualString);
        });
    });*/
});

describe("Contagem de Tarefas", () => {

    let tarefa = "Tarefa 1";

    it("Exibir contagem total de tarefas", () => {
        cy.visit("https://phpauloreis.github.io/todo-list-alpine-js/");
        cadastra3Tarefas();
        cy.get('.pt-3 > .col-auto > .btn').select('Todos')
        cy.get('.mb-3').should('contain', 'Tarefas cadastradas: 3');
    });

    it("Exibir contagem de tarefas em aberto", () => {
        cy.visit("https://phpauloreis.github.io/todo-list-alpine-js/");
        cadastra3Tarefas();
        cy.get(':nth-child(2) > :nth-child(1) > .form-check-input').click();
        cy.get('.pt-3 > .col-auto > .btn').select('Em aberto')
        cy.get('.mb-3').should('contain', 'Tarefas cadastradas: 2');
    });

    it("Exibir contagem de tarefas concluídas", () => {
        cy.visit("https://phpauloreis.github.io/todo-list-alpine-js/");
        cadastra3Tarefas();
        cy.get(':nth-child(2) > :nth-child(1) > .form-check-input').click();
        cy.get('.pt-3 > .col-auto > .btn').select('Concluídos')
        cy.get('.mb-3').should('contain', 'Tarefas cadastradas: 1');

    });
});

describe("Filtrar Tarefas", () => {

    it("Filtrar todas as tarefas", () => {
        cy.visit("https://phpauloreis.github.io/todo-list-alpine-js/");
        cadastra3Tarefas();
        cy.get('.pt-3 > .col-auto > .btn').select('Todos')
        cy.get('.mb-3').should('contain', 'Tarefas cadastradas: 3');
        cy.get('.completed > [x-text="todo.task"]')
    });

    it("Filtrar tarefas em aberto", () => {
        cy.visit("https://phpauloreis.github.io/todo-list-alpine-js/");
        cadastra3Tarefas();
        cy.get(':nth-child(2) > :nth-child(1) > .form-check-input').click();
        cy.get('.pt-3 > .col-auto > .btn').select('Em aberto')
        cy.get('.mb-3').should('contain', 'Tarefas cadastradas: 2');
    });

    it("Filtrar tarefas concluídas", () => {
        cy.visit("https://phpauloreis.github.io/todo-list-alpine-js/");
        cadastra3Tarefas();
        cy.get(':nth-child(2) > :nth-child(1) > .form-check-input').click();
        cy.get('.pt-3 > .col-auto > .btn').select('Concluídos')
        cy.get('.mb-3').should('contain', 'Tarefas cadastradas: 1');
    });
});

describe("Remoção de Tarefas", () => {
    it("Remover uma tarefa", () => {
        visita();
        cadastra3Tarefas();
        // Seleciona uma tarefa para remover
        cy.get(':nth-child(2) > .btn-danger').click();
        // Verifica se o popup de confirmação é exibido
        cy.on('window:confirm', (str) => {
            expect(str).to.equal(`Tem certeza que deseja remover?`)
        });
        // Confirma a remoção
        cy.get('.swal-button--confirm').click();
        // Verifica se a tarefa foi removida da lista
        cy.contains('[x-text="todo.task"]', tarefa1).should('not.exist');
    });
});

describe("Marcar Tarefas como Concluídas", () => {
    beforeEach(() => {
        visita();
        cadastra3Tarefas();
    });

    it("Marcar uma tarefa como concluída", () => {
        // Seleciona uma tarefa em aberto
        cy.get(':nth-child(2) > :nth-child(1) > .form-check-input').check();
        // Verifica se a tarefa foi marcada como concluída
        cy.get(':nth-child(2) > :nth-child(2)').should('have.class', 'line-through');
    });

    it("Desmarcar uma tarefa concluída", () => {
        // Marca uma tarefa como concluída
        cy.get(':nth-child(2) > :nth-child(1) > .form-check-input').check();
        // Desmarca a mesma tarefa
        cy.get(':nth-child(2) > :nth-child(1) > .form-check-input').uncheck();
        // Verifica se a marcação de conclusão foi removida
        cy.get(':nth-child(2) > :nth-child(2)').should('not.have.class', 'line-through');
    });
});


