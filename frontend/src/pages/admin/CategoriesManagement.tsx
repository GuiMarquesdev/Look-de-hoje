import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus, Search, Edit, Trash2, Tags } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const API_URL = "http://localhost:3000/api"; // Você pode usar o caminho real ou a constante

interface Category {
  id: string;
  name: string;
  piece_count?: number;
  created_at: string;
  updated_at: string;
}

const categorySchema = z.object({
  name: z.string().min(1, "Nome da categoria é obrigatório"),
});

const CategoriesManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`);
      if (!response.ok) throw new Error("Erro ao buscar categorias");

      const categories: Category[] = await response.json();

      // Count pieces for each category
      const categoriesWithCount = await Promise.all(
        categories.map(async (category) => {
          // Chamada simulada para contar peças. Você deve implementar o endpoint: GET /api/pieces/count?category_id=ID
          // Por enquanto, vamos mockar ou assumir que o backend enviou a contagem se for eficiente.
          // Se o backend tiver sido implementado para incluir o count:
          // return category;

          // Se for necessário chamar o backend para contar:
          // const countResponse = await fetch(`${API_URL}/categories/${category.id}/count-pieces`);
          // const { count } = await countResponse.json();
          // return { ...category, piece_count: count || 0 };

          // Para fins de migração, manteremos o mock/assumido
          return { ...category, piece_count: category.piece_count ?? 0 };
        })
      );

      setCategories(categoriesWithCount);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Erro ao carregar categorias");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof categorySchema>) => {
    const method = editingCategory ? "PUT" : "POST";
    const url = editingCategory
      ? `${API_URL}/categories/${editingCategory.id}`
      : `${API_URL}/categories`;

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: values.name }), // Envia apenas o nome
      });

      // A API deve retornar 200/201 em caso de sucesso
      if (response.status === 409) {
        // Assumindo 409 para conflito (UNIQUE constraint violation)
        toast.error("Já existe uma categoria com este nome");
        return;
      }

      if (!response.ok) throw new Error("Erro ao salvar categoria");

      toast.success(
        `Categoria ${editingCategory ? "atualizada" : "criada"} com sucesso!`
      );

      setIsDialogOpen(false);
      setEditingCategory(null);
      form.reset();
      fetchCategories();
    } catch (error: any) {
      console.error("Error saving category:", error);
      // Aqui, o código de erro 23505 (UNIQUE violation do Postgres) foi mapeado para 409 no backend
      toast.error("Erro ao salvar categoria");
    }
  };

  const deleteCategory = async (category: Category) => {
    try {
      // 3. REGRA DE NEGÓCIO: Verificar se há peças (idealmente, a API deveria retornar 400)
      if (category.piece_count && category.piece_count > 0) {
        toast.error("Não é possível excluir categoria que possui peças");
        return;
      }

      // 4. CHAMA O NOVO ENDPOINT DE DELEÇÃO
      const response = await fetch(`${API_URL}/categories/${category.id}`, {
        method: "DELETE",
      });

      if (response.status === 400) {
        // Se a API retornar erro por haver peças
        toast.error("Não é possível excluir categoria que possui peças");
        return;
      }

      if (!response.ok) throw new Error("Erro ao excluir categoria");

      toast.success(`Categoria "${category.name}" removida`);
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Erro ao excluir categoria");
    }
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    form.reset({ name: category.name });
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingCategory(null);
    form.reset({ name: "" });
    setIsDialogOpen(true);
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-foreground">
            Gestão de Categorias
          </h1>
          <p className="text-muted-foreground font-montserrat">
            Organize suas peças por categorias
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={openAddDialog}
              className="flex items-center gap-2 bg-primary hover:bg-primary-dark font-montserrat"
            >
              <Plus className="w-4 h-4" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-playfair">
                {editingCategory ? "Editar Categoria" : "Nova Categoria"}
              </DialogTitle>
              <DialogDescription className="font-montserrat">
                {editingCategory
                  ? "Atualize o nome da categoria."
                  : "Crie uma nova categoria para organizar suas peças."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-montserrat">
                        Nome da Categoria
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite o nome da categoria"
                          {...field}
                          className="font-montserrat"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="font-montserrat"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary-dark font-montserrat"
                  >
                    Salvar
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="luxury-card">
        <CardHeader>
          <CardTitle className="font-playfair flex items-center gap-2">
            <Tags className="w-5 h-5 text-primary" />
            Categorias
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar categorias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm font-montserrat"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-montserrat">Nome</TableHead>
                <TableHead className="font-montserrat">
                  Quantidade de Peças
                </TableHead>
                <TableHead className="text-right font-montserrat">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium font-montserrat">
                    {category.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-montserrat">
                      {category.piece_count} peças
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel className="font-montserrat">
                          Ações
                        </DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => openEditDialog(category)}
                          className="font-montserrat"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => deleteCategory(category)}
                          className="text-destructive font-montserrat"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredCategories.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center py-8 text-muted-foreground font-montserrat"
                  >
                    Nenhuma categoria encontrada
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoriesManagement;
