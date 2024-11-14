import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Grid, LinearProgress, Paper, Typography } from '@mui/material';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';

import { CandidatosService } from '../../shared/services/api/candidatos/CandidatosService';
import { FerramentasDeDetalhe } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { VTextField } from '../../shared/forms';


interface IFormData {
  name: string;
  email: string;
  telephone: string;
  password: string;
  cpf: string;
  genre: string;
  birthDate: Date;
  role: number[];
}

export const DetalheDeCandidatos: React.FC = () => {
  const { id = 'novo' } = useParams<'id'>();
  const navigate = useNavigate();

  const formRef = useRef<FormHandles>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [nome, setNome] = useState('');

  useEffect(() => {
    if (id !== 'novo') {
      setIsLoading(true);

      CandidatosService.getById(Number(id))
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            alert(result.message);
            navigate('/candidatos');
          } else {
            setNome(result.name);
            formRef.current?.setData(result);
          }
        });
    }
  }, [id]);


  const handleSave = (dados: IFormData) => {
    setIsLoading(true);

    if (id === 'novo') {
      CandidatosService
        .create(dados)
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            alert(result.message);
          } else {
            navigate(`/candidatos/detalhe/${result}`);
          }
        });
    } else {
      CandidatosService
        .updateById(Number(id), { id: Number(id), ...dados })
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            alert(result.message);
          }
        });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Realmente deseja apagar?')) {
      CandidatosService.deleteById(id)
        .then(result => {
          if (result instanceof Error) {
            alert(result.message);
          } else {
            alert('Registro apagado com sucesso!');
            navigate('/candidatos');
          }
        });
    }
  };


  return (
    <LayoutBaseDePagina
      titulo={id === 'novo' ? 'Novo candidato' : nome}
      barraDeFerramentas={
        <FerramentasDeDetalhe
          textoBotaoNovo='Novo'
          mostrarBotaoSalvarEFechar
          mostrarBotaoNovo={id !== 'novo'}
          mostrarBotaoApagar={id !== 'novo'}

          aoClicarEmVoltar={() => navigate('/candidatos')}
          aoClicarEmApagar={() => handleDelete(Number(id))}
          aoClicarEmSalvar={() => formRef.current?.submitForm()}
          aoClicarEmNovo={() => navigate('/candidatos/detalhe/novo')}
          aoClicarEmSalvarEFechar={() => formRef.current?.submitForm()}
        />
      }
    >
      <Form ref={formRef} onSubmit={handleSave}>
        <Box margin={1} display="flex" flexDirection="column" component={Paper} variant="outlined">

          <Grid container direction="column" padding={2} spacing={2}>

            {isLoading && (
              <Grid item>
                <LinearProgress variant='indeterminate' />
              </Grid>
            )}

            <Grid item>
              <Typography variant='h6'>Geral</Typography>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  name='name'
                  disabled={isLoading}
                  label='Nome completo'
                  onChange={e => setNome(e.target.value)}
                />
              </Grid>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  name='email'
                  label='Email'
                  disabled={isLoading}
                />
              </Grid>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  label='Telefone'
                  name='telephone'
                  disabled={isLoading}
                />
              </Grid>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  name='cpf'
                  label='CPF'
                  disabled={isLoading}
                />
              </Grid>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  name='genre'
                  label='Gênero'
                  disabled={isLoading}
                />
              </Grid>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  name='birthDate'
                  label='Nascimento'
                  disabled={isLoading}
                />
              </Grid>
            </Grid>

          </Grid>

        </Box>
      </Form>
    </LayoutBaseDePagina>
  );
};