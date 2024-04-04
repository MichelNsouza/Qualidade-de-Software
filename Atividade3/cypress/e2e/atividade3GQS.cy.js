const tarefa = "Tarefa 0";
const tarefa1 = "Tarefa 1";
const tarefa2 = "Tarefa 2";
const tarefa3 = "Tarefa 3";

function visita(){
    cy.visit("https://phpauloreis.github.io/todo-list-alpine-js/");
}
function cadastraTarefa(){
    cy.get('#todo_title').click().type(tarefa);
    cy.get('.bg-white > .col-auto > .btn').click();
}
function cadastra3Tarefas(){
        cy.get('#todo_title').click().type(tarefa1);
        cy.get('.bg-white > .col-auto > .btn').click();

        cy.get('#todo_title').click().type(tarefa2);
        cy.get('.bg-white > .col-auto > .btn').click();

        cy.get('#todo_title').click().type(tarefa3);
        cy.get('.bg-white > .col-auto > .btn').click();
}

describe("gostaria de poder adicionar uma tarefa", () => {
    beforeEach(() => {
        visita()
    });

    it("Adicionar uma nova tarefa com click", () => {
        cy.get('#todo_title').click().type(tarefa);
        cy.get('.bg-white > .col-auto > .btn').click();
        cy.contains('[x-text="todo.task"]', tarefa);
    });
    it("Adicionar uma nova tarefa pressionando Enter", () => {
        cy.get('#todo_title').click().type(tarefa1);
        cy.get('.bg-white > .col-auto > .btn').type('{enter}');
        cy.contains('[x-text="todo.task"]', tarefa1);
    });
    it('Adicionar uma nova tarefa em branco com click, exibe erro', () => {
        cy.get('.bg-white > .col-auto > .btn').click()
        cy.on('window:alert', (msg) => {
          expect(msg).to.equal('Digite um título para a tarefa!')   
      })
      cy.on('window:confirm', () => true)
        cy.get('.mb-3').should("have.text", "Tarefas cadastradas: 0")
    })

    it('Adicionar uma nova tarefa em branco com enter, exibe erro', () => {
        cy.get('#todo_title').type('{enter}');
        cy.on('window:alert', (msg) => {
          expect(msg).to.equal('Digite um título para a tarefa!')   
      })
      cy.on('window:confirm', () => true)
        cy.get('.mb-3').should("have.text", "Tarefas cadastradas: 0")
    })
    it('nova tarefa adicionada possui data correta', () => {
        cy.get('#todo_title').click().type(tarefa);
        cy.get('.bg-white > .col-auto > .btn').click();
        cy.get('[x-text="getFormatedDate(todo.createdAt)"]').then(($dataElement) => {
            const dataNaPagina = $dataElement.text().trim();
            const [month, day, year] = dataNaPagina.split('/');
            // Formatar o mês e o dia para terem dois dígitos
            const mesFormatado = month.padStart(2, '0');
            const diaFormatado = day.padStart(2, '0');
            // Formatando a data na página para "MM/DD/YYYY"
            const dataNaPaginaFormatada = `${mesFormatado}/${diaFormatado}/${year}`;
            // Obtendo a data atual incluindo a hora atual
            const dataAtual = new Date();
            const horaAtual = `${dataAtual.getHours()}:${dataAtual.getMinutes()}`;
            const dataAtualString = `${dataAtual.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })} ${horaAtual}`;
            // Comparando as datas
            cy.wrap(dataNaPaginaFormatada).should('eq', dataAtualString);
        });
    })

    /*
    it('Adicionar uma nova tarefa em branco com click, exibe erro', () => {
        cy.get('.mb-3').then(($referencia) => {
            const textoReferencia = $referencia.text().trim();
            
            cy.get('.bg-white > .col-auto > .btn').click();
            
            cy.on('window:alert', (msg) => {
                expect(msg).to.equal('Digite um título para a tarefa!');
            });
            
            cy.on('window:confirm', () => true);
            
            cy.get('.mb-3').should(($novoReferencia) => {
                expect($novoReferencia.text().trim()).to.equal(textoReferencia);
            });
        });
    });
    */ 
});

describe("Marcar Tarefas como Concluídas", () => {
    beforeEach(() => {
        visita();
        cadastraTarefa();
    });

    it("Marcar uma tarefa como concluída", () => {
        cy.get(':nth-child(2) > :nth-child(1) > .form-check-input').check();
        cy.get(':nth-child(2) > :nth-child(2)').should('have.class', 'completed')
    });

    it("Desmarcar uma tarefa concluída", () => {
        cy.get(':nth-child(2) > :nth-child(1) > .form-check-input').check();
        cy.get(':nth-child(2) > :nth-child(1) > .form-check-input').uncheck();
        cy.get(':nth-child(2) > :nth-child(2)').should('not.have.class', 'completed');
    });
});

describe("gostaria de poder remover tarefas da lista", () => {
    beforeEach(() => {
        visita();
        cadastraTarefa();
    });
    it("Remover uma tarefa", () => {
    cy.get('.text-end > .btn').click()
    cy.on('window:alert', (msg) => {
        expect(msg).to.equal('Tem certeza que deseja remover?')
    })
    cy.on('window:confirm', () => true)
    cy.get('.mb-3').should("have.text", "Tarefas cadastradas: 0")
    })

    it("Desistir de Remover uma tarefa", () => {
        cy.get('.text-end > .btn').click()
        cy.on('window:alert', (msg) => {
            expect(msg).to.equal('Tem certeza que deseja remover?')
        })
        cy.on('window:confirm', () => false)
        cy.get('.mb-3').should("have.text", "Tarefas cadastradas: 1")
        })
});

describe("gostaria de poder filtrar as tarefas exibidas na lista", () => {
    beforeEach(() => {
        visita();
        cadastra3Tarefas();
    });

    it("Filtrar todas as tarefas", () => {
        cy.get('.pt-3 > .col-auto > .btn').select('Todos')
        cy.get(':nth-child(2) > [x-text="todo.task"]').should('contain', tarefa1);
        cy.get(':nth-child(3) > [x-text="todo.task"]').should('contain', tarefa2);
        cy.get(':nth-child(4) > [x-text="todo.task"]').should('contain', tarefa3);
    });
    it("Filtrar tarefas em aberto", () => {
        cy.get(':nth-child(2) > :nth-child(1) > .form-check-input').click();
        cy.get('.pt-3 > .col-auto > .btn').select('Em aberto')
        cy.get(':nth-child(2) > [x-text="todo.task"]').should('contain', tarefa2);
        cy.get(':nth-child(3) > [x-text="todo.task"]').should('contain', tarefa3);
    });

    it("Filtrar tarefas concluídas", () => {
        cy.get(':nth-child(2) > :nth-child(1) > .form-check-input').click();
        cy.get('.pt-3 > .col-auto > .btn').select('Concluídos')
        cy.get(':nth-child(2) > [x-text="todo.task"]').should('contain', tarefa1);
    });
});

describe("gostaria de ver a contagem de tarefas de acordo com o filtro ", () => {

    beforeEach(() => {
        visita();
        cadastra3Tarefas();
    });

    it("Exibir contagem total de tarefas", () => {
        cy.get('.pt-3 > .col-auto > .btn').select('Todos')
        cy.get('.mb-3').should('contain', 'Tarefas cadastradas: 3');
    });

    it("Exibir contagem de tarefas em aberto", () => {
        cy.get(':nth-child(2) > :nth-child(1) > .form-check-input').click();
        cy.get('.pt-3 > .col-auto > .btn').select('Em aberto')
        cy.get('.mb-3').should('contain', 'Tarefas cadastradas: 2');
    });

    it("Exibir contagem de tarefas concluídas", () => {
        cy.get(':nth-child(2) > :nth-child(1) > .form-check-input').click();
        cy.get('.pt-3 > .col-auto > .btn').select('Concluídos')
        cy.get('.mb-3').should('contain', 'Tarefas cadastradas: 1');

    });
});
